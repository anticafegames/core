import { appName, gamePrefix } from '../../config/app-config'
import { createSelector } from 'reselect'
import { Record, OrderedMap, List } from 'immutable'
import { call, put, takeEvery, all, select, take, delay } from 'redux-saga/effects'

import { bindSocketEvents } from '../../code/socket/bind-socket-events-helper'
import { iSocketResult, iSocketAction } from '../socket/entity/interface'
import { todo } from '../../code/messages'
import { gameKey } from '../games-common/entity/interface'
import MainEntity, { iMainEntity } from './entity/main-entity'
import { socketEmit, socketEmitAndWaitData } from '../../code/socket/socket-emit'
import Toasts from '../../code/alerts/toast'

/*
*   Contstants 
*/

export const moduleName = 'game-add-data'
export const socketPrefix = 'game-add-data'

const prefix = `${appName}/${moduleName}`

export const ADD_GAME_DATA_REQUEST = `${prefix}/ADD_GAME_DATA_REQUEST`

export const GET_PREVIEW_TO_ADD_DATA_REQUEST = `${prefix}/GET_PREVIEW_TO_ADD_DATA_REQUEST`
export const GET_PREVIEW_TO_ADD_SOCKET_EVENT = `${prefix}/GET_PREVIEW_TO_ADD_SOCKET_EVENT`
export const GET_PREVIEW_TO_ADD_DATA_SUCCESS = `${prefix}/GET_PREVIEW_TO_ADD_DATA_SUCCESS`
export const GET_PREVIEW_TO_ADD_DATA_LOADING = `${prefix}/GET_PREVIEW_TO_ADD_DATA_LOADING`

/*
*   Reducer
*/

export default function reducer(state = new MainEntity(), action: any) {

    const type = action.type
    const payload = action.payload

    switch (type) {

        case GET_PREVIEW_TO_ADD_DATA_SUCCESS:
            return state.setPreviewToAddData(payload)

        case GET_PREVIEW_TO_ADD_DATA_LOADING:
            return state.previewToAddDataLoading(payload.loading)

        default:
            return state

    }
}

/*
*   Selectors
*/

export const stateSelector = (state: any) => state[moduleName] as MainEntity

export const previewDataSelector = createSelector(stateSelector, state => state.getobject().previewToAddData)
export const loadingPreviewToAddDataSelector = createSelector(stateSelector, state => state.getobject().loadingPreviewToAddData)

/*
*   Action Creaters
*/

export function addGameData(gameKey: gameKey, data: any) {
    return {
        type: ADD_GAME_DATA_REQUEST,
        payload: { gameKey, data }
    }
}

export function getPreviewToAddData(gameKey: gameKey) {
    return {
        type: GET_PREVIEW_TO_ADD_DATA_REQUEST,
        payload: { gameKey }
    }
}

export function clearPreviewToAddData() {
    return {
        type: GET_PREVIEW_TO_ADD_DATA_SUCCESS,
        payload: { data: null }
    }
}

/*
*   Sagas
*/

export function* addGameDataSaga({ payload }: any) {

    const { gameKey, data } = payload
    
    if (data) {
        yield call(socketEmit, `${socketPrefix}/add-game-data`, { gameKey, data })
    }
}

export function* previewToAddDataSaga({ payload }: any): any {

    const { gameKey } = payload

    yield put({
        type: GET_PREVIEW_TO_ADD_DATA_LOADING,
        payload: { loading: true }
    })

    const data = yield socketEmitAndWaitData(`${socketPrefix}/get-preview-to-add-data`, { gameKey }, false, GET_PREVIEW_TO_ADD_SOCKET_EVENT)

    //Чтобы полюбовались на лоадинг)))
    yield(delay(1000))

    if (data.error) {

        yield call(Toasts.messageToast, data.error)

        return yield put({
            type: GET_PREVIEW_TO_ADD_DATA_LOADING,
            payload: { loading: false }
        })
    }
    
    yield put({
        type: GET_PREVIEW_TO_ADD_DATA_SUCCESS,
        payload: { gameKey, data: data.result }
    })
}

export function* saga() {
    yield all([
        takeEvery(ADD_GAME_DATA_REQUEST, addGameDataSaga),
        takeEvery(GET_PREVIEW_TO_ADD_DATA_REQUEST, previewToAddDataSaga)
    ])
}