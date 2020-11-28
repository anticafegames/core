import { appName } from '../../config/app-config'
import { vkAppId } from '../../config/vk-config'
import { createSelector } from 'reselect'
import { Record, OrderedMap, List } from 'immutable'
import { call, put, takeEvery, all, select, take, fork } from 'redux-saga/effects'

import VKApi from '../../code/api/vk-api/vk-api'
import { logInSaga } from '../authentication'
import MainEntity from './entity/main-entity'
import { socketEmitAndWaitData } from '../../code/socket/socket-emit'
import { showGlobalPreloader, hidePreloader } from '../global-preloader'
import RoomPeer, { iPeerRoomSocketResponse } from '../webrtc-room/entity/room-peer-entity'
import { iRoomSocketResponse, iRoom } from '../webrtc-room/entity/room-entity'
import { iSiteInfo } from './entity/site-info-entity'

/*
*   Contstants 
*/

export const moduleName = 'admin'
export const socketEventPrefix = 'admin'

const prefix = `${appName}/${moduleName}`

export const LOAD_SITE_INFO_REQUEST = `${prefix}/LOAD_SITE_INFO_REQUEST`
export const LOAD_SITE_INFO_SOCKET_EVENT = `${prefix}/LOAD_SITE_INFO_SOCKET_EVENT`
export const LOAD_SITE_INFO_SUCCESS = `${prefix}/LOAD_SITE_INFO_SUCCESS`

export const CHANGE_LOADING = `${prefix}/CHANGE_LOADING`

export const CLEAR_SITE_INFO = `${prefix}/CLEAR_SITE_INFO`

/*
*   Reducer
*/


export default function reducer(state = new MainEntity(), action: any) {
    const { type, payload } = action

    switch (type) {
                
        case LOAD_SITE_INFO_SUCCESS: 
            return state
                .setSiteInfo(payload.siteInfo)

        case CLEAR_SITE_INFO:
            return state
                .clearSiteInfo()
        
        case CHANGE_LOADING:
            return state
                .changeLoading(payload.loading)

        default:
            return state

    }
}

/*
*   Selectors
*/

export const stateSelector = (state: any) => state[moduleName] as MainEntity


/*
*   Action Creaters
*/

export function loadSiteInfo() {
    return {
        type: LOAD_SITE_INFO_REQUEST
    }
}

export function clearSiteInfo() {
    return {
        type: CLEAR_SITE_INFO
    }
}

/*
*   Sagas
*/

export function* loadSiteInfoSocketSaga() {

    try {

        yield fork(showGlobalPreloader, 'admin-load-site-info', 'admin-load-site-info', 0, true)
        yield put({
            type: CHANGE_LOADING,
            payload: { loading: true }
        })
        
        const auth = yield call(logInSaga)

        if (!auth) {
            throw new Error('Ошибка при авторизации')
        }

        const { error, result } = yield call(socketEmitAndWaitData, `${socketEventPrefix}/site-info`, {}, true, LOAD_SITE_INFO_SOCKET_EVENT)
        
        if(error) {
            throw new Error(error)
        }
        
        const responceUsers: iPeerRoomSocketResponse[] = result.users
        const responceRooms: iRoomSocketResponse[] = result.rooms

        const users: RoomPeer[] = yield call(VKApi.loadRoomPeers, responceUsers)
        const rooms: iRoom[] = responceRooms.map(room => {
            return {
                ...room,
                users: room.users.map((user: iPeerRoomSocketResponse) => users.find(item => item.id === user.id))
            } as iRoom
        })

        const siteInfo: iSiteInfo = { users, rooms }

        yield put({
            type: LOAD_SITE_INFO_SUCCESS,
            payload: { siteInfo }
        })
        
    }
    catch(error) {
        console.error(error)

        yield put({
            type: CHANGE_LOADING,
            payload: { loading: false }
        })
    }

    yield call(hidePreloader, 'admin-load-site-info')
}

export function* saga() {
    yield all([
        takeEvery(LOAD_SITE_INFO_REQUEST, loadSiteInfoSocketSaga)
    ])
}