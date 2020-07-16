import io from 'socket.io-client'
import { call, put, takeEvery, all, select } from 'redux-saga/effects'
import { createSelector } from 'reselect'
import { Record, OrderedMap, List } from 'immutable'
import { eventChannel } from "redux-saga"

import { todo, infoMessage } from '../../code/messages'
import { socketUrl, appName } from '../../config/app-config'

import { getSocketType } from '../../code/socket'
import Api from '../../code/api'
import MainEntity from './entity/main-entity'


/*
*   Contstants в ./constants.ts
*/

export const moduleName = 'socket'

const prefix = `${appName}/${moduleName}`

export const SOCKET_CONNECT_REQUEST = `${prefix}/SOCKET_CONNECT_REQUEST`
export const SOCKET_CONNECT_SUCCESS = `${prefix}/SOCKET_CONNECT_SUCCESS`

export const SOCKET_OPEN_EVENT_CHANNEL_REQUEST = `${prefix}/SOCKET_OPEN_EVENT_CHANNEL_REQUEST`
export const SOCKET_OPEN_EVENT_CHANNEL_SUCCESS = `${prefix}/SOCKET_OPEN_EVENT_CHANNEL_SUCCESS`

export const ADD_SOCKET_EVENTS = `${prefix}/ADD_SOCKET_EVENTS`
export const DELETE_SOCKET_EVENTS = `${prefix}/DELETE_SOCKET_EVENTS`

export const SOCKET_EMIT = `${prefix}/SOCKET_EMIT`

/*
*   Reducer
*/

export default function reducer(state = new MainEntity(), action: any) {
    const { type, payload } = action

    switch (type) {

        case SOCKET_CONNECT_SUCCESS:
            return state.setSocket(payload.socket)

        case ADD_SOCKET_EVENTS:
            return state.addSocketEvent(payload.events)

        case DELETE_SOCKET_EVENTS:
            return state.deleteSocketEvent(payload.events)

        default:
            return state

    }
}

/*
*   Selectors
*/

export const stateSelector = (state: any) => state[moduleName]

export const socketSelector = createSelector(stateSelector, state => state.socket)
export const socketEventsSelector = createSelector(stateSelector, state => state.socketEvents.toJS())

/*
*   Action Creaters
*/



/*
*   Sagas
*/

export function* socketConnect() {

    const y = yield call(Api.GET, 'hello', null)
    
    const socket = io.connect(socketUrl, { secure: false })

    yield put({
        type: SOCKET_CONNECT_SUCCESS,
        payload: { socket }
    })

    yield put({
        type: SOCKET_OPEN_EVENT_CHANNEL_REQUEST
    })
}

export function* emit({ payload }: any) {

    const { event, data, selector } = payload
    const socket: SocketIOClient.Socket = yield select(selector)

    if (!socket) return

    infoMessage(`socket emit ${event}`, data)
    socket.emit(event, data)
}

export function* listenEventChannel() {

    const socket: SocketIOClient.Socket = yield select(socketSelector)

    if (!socket) return

    const channel = eventChannel((emit: any) => {

        const unsubscribe = () => {
            todo('Отписаться от канала', 'duck/webrtc')
        }

        return unsubscribe
    })
}

export function* saga() {
    yield all([
        socketConnect(),
        takeEvery(SOCKET_EMIT, emit)
    ])
}