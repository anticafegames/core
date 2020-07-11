import { appName } from '../../config/app-config'
import { createSelector } from 'reselect'
import { Record, OrderedMap, List } from 'immutable'
import { delay, eventChannel, takeLatest } from 'redux-saga'
import { call, put, takeEvery, all, select, take, fork } from 'redux-saga/effects'

import { bindSocketEvents, getSagaKeyUnbindSocket } from '../../code/socket/bind-socket-events-helper'
import { socketEmit } from '../../code/socket/socket-emit'
import { iSocketResult, iSocketAction } from '../socket/entity/interface'
import { todo, infoMessage } from '../../code/messages'
import { iPeersConnection } from '../webrtc/entity/peer-connection-entity'
import { waitBindSocket } from '../../code/socket/bind-socket-events-helper'
import { logInSaga } from '../authentication'
import { arrayToList } from '../../code/ducks/ducks-helper'
import MainEntity from './entity/main-entity'
import { iRoom } from '../webrtc-room/entity/room-entity'
import VKApi from '../../code/api/vk-api/vk-api'
import RoomPeerEntity from '../webrtc-room/entity/room-peer-entity'
import { listenEvent } from '../../code/ducks/saga-helper'

/*
*   Contstants 
*/

export const moduleName = 'window-settings'

const prefix = `${appName}/${moduleName}`

export const SET_SIZE = `${prefix}/SET_SIZE`
export const RESIZE_WINDOW_REQUEST = `${prefix}/RESIZE_WINDOW_REQUEST`

/*
*   Reducer
*/

export default function reducer(state = new MainEntity(), action: any) {
    const { type, payload } = action

    switch (type) {

        case SET_SIZE: 
            return state
                .setSize(payload.width, payload.height)

        default:
            return state

    }
}

/*
*   Selectors
*/

export const stateSelector = (state: any) => state[moduleName]



/*
*   Action Creaters
*/



/*
*   Sagas
*/

export function* bindResizeEventSaga() {

    const rootDiv = document.getElementById('root')

    const width = rootDiv!.offsetWidth
    const height = rootDiv!.offsetHeight

    yield put({
        type: SET_SIZE,
        payload: { width, height }
    })

    //yield fork(listenResizeWindow, rootDiv!)
}

export function* listenResizeWindow(rootDiv: HTMLElement) {
    
    yield call(listenEvent, (emit: any) => {
        debugger
        rootDiv.addEventListener('resize', (event: any) => { debugger; emit(event); });
        return () => { }
    }, RESIZE_WINDOW_REQUEST, '')
}
 
export function* resizeWindowEvent({ payload }: any) {
    
}

export function* saga() {
    yield all([])
}