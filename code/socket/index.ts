import { eventChannel, Channel } from 'redux-saga'
import { select, take, put, call } from 'redux-saga/effects'

import { iSocketResult, iSocketAction } from '../../ducks/socket/entity/interface'
import { SOCKET_EMIT, SOCKET_CONNECT_SUCCESS, socketSelector, socketEventsSelector, DELETE_SOCKET_EVENTS, ADD_SOCKET_EVENTS } from '../../ducks/socket'

import { todo, infoMessage } from '../messages'
import { iSocketType } from './interfaces'

export function* getSocket() {

    const socketType = getSocketType()

    let socket: SocketIOClient.Socket = yield select(socketType.selector)

    if (!socket) {
        const { payload } = yield take(socketType.connectSuccessConst)
        socket = payload.socket
    }

    return yield socket
}

export function getSocketType() {

    let socketType: iSocketType = {
        selector: socketSelector,
        connectSuccessConst: SOCKET_CONNECT_SUCCESS,
        eventsSelector: socketEventsSelector,
        addEventsKey: ADD_SOCKET_EVENTS,
        deleteEventsKey: DELETE_SOCKET_EVENTS
    }

    return socketType
}