
import { Channel, eventChannel } from 'redux-saga'
import { call, take, select, put, race, all, spawn, delay } from 'redux-saga/effects'
import SocketIOClient from 'socket.io-client'

import { iSocketAction, iSocketResult } from '../../ducks/socket/entity/interface'

import { getSocket, getSocketType } from './index'
import { infoMessage, todo } from '../messages'
import { iSocketType } from './interfaces'

export function* bindSocketEvents(socketActions: iSocketAction[]): any {
    
    const filteredActions = yield call(filterSocketActions, socketActions)
    let socket = yield call(getSocket)
    
    return yield call(createEventsChannels, filteredActions, socket)
}

export function* addSocketEvents(events: string[]) {

    infoMessage('add socket events', events)

    const socketType: iSocketType = getSocketType()

    yield put({
        type: socketType.addEventsKey,
        payload: { events }
    })
}

export function* deleteSocketEvents(events: string[]) {

    const socketType: iSocketType = getSocketType()

    yield put({
        type: socketType.deleteEventsKey,
        payload: { events }
    })
}

export function* filterSocketActions(socketActions: iSocketAction[], returnUnListened: boolean = true) {

    const socketType = getSocketType()
    let listeningEvents: string[] = yield select(socketType.eventsSelector)

    return socketActions.filter(key => listeningEvents.includes(key.sagaKey) !== returnUnListened)
}

export const getSagaKeyUnbindSocket = (key: string) => `${key}_UNBIND_SOCKET`

export function* waitBindSocket(key: string) {
    
    const socketType = getSocketType()
    let events: string[] = yield select(socketType.eventsSelector)

    infoMessage(`Ждем bind event ${key}`)

    while (events == null || !events.includes(key)) {

        yield race({
            delay: delay(300),
            saga: take(socketType.addEventsKey)
        })

        events = yield select(socketType.eventsSelector)
    }

    infoMessage(`Дождались event ${key}`)

    return
}

function* createEventsChannels(actions: iSocketAction[], socket: SocketIOClient.Socket): any {
    return yield all(actions.map(action => createEventsChannel(action, socket)))
}

function* createEventsChannel(action: iSocketAction, socket: SocketIOClient.Socket): any {
    const channel = yield call(eventChannel, (emit: any) => bindSocketAction(action, socket, emit))
    yield spawn(listenSocketEvent, action, channel)
    yield call(addSocketEvents, [action.sagaKey])
}

function* listenSocketEvent(action: iSocketAction, channel: Channel<any>) {

    const unbindSagaKey = getSagaKeyUnbindSocket(action.sagaKey)

    while (true) {

        const { channelResult, unbindEvent } = yield race({
            channelResult: take(channel),
            unbindEvent: take(unbindSagaKey)
        })

        if (!unbindEvent) {

            const result: iSocketResult = channelResult
            const { sagaKey: type, data: payload } = result

            yield put({ type, payload })

        } else {

            infoMessage(`Отвязались от сокет события ${unbindSagaKey}`)

            yield call(channel.close)
            yield call(deleteSocketEvents, [action.sagaKey])

            return
        }
    }
}

function bindSocketAction(action: iSocketAction, socket: SocketIOClient.Socket, emit: any) {
    
    const socketKey = action.socketKey
    const sagaKey = action.sagaKey

    infoMessage(`Привязались к событию event ${socketKey}, saga ${sagaKey}`)

    socket.on(socketKey, (data: any) => {

        infoMessage(`Сокет ивент socket ${socketKey}, saga ${sagaKey}`)

        const result: iSocketResult = {
            socketKey,
            sagaKey,
            data
        }

        emit(result)
    })

    return () => socket.off(action.socketKey)
}