import { call, put, select, fork, take, race } from 'redux-saga/effects'

import { getSocketType } from '.'
import { SOCKET_EMIT } from '../../ducks/socket'
import { anticafeTokenSelector } from '../../ducks/authentication'
import { iSocketAction } from '../../ducks/socket/entity/interface'
import { bindSocketEvents, waitBindSocket, getSagaKeyUnbindSocket } from './bind-socket-events-helper'
import { delay as delaySaga } from 'redux-saga'


export function* socketEmit(event: string, data: any, isProtectedEvent: boolean = false) {

    if(isProtectedEvent) {
        yield protectedData(data)
    }

    const { selector } = getSocketType()

    yield put({
        type: SOCKET_EMIT,
        payload: {
            selector,
            event,
            data
        }
    })
}

function* protectedData(data: any) {
    const token = yield select(anticafeTokenSelector)
    data['token'] = token
}

export function* socketEmitAndWaitData(event: string, data: any, isProtectedEvent: boolean = false, sagaKey: string, delay: number = 10000) {

    const socketAction: iSocketAction = {
        socketKey: event,
        sagaKey: sagaKey
    }

    yield fork(bindSocketEvents, [socketAction])
    yield call(waitBindSocket, sagaKey)

    yield call(socketEmit, event, data, isProtectedEvent)


    const { result, delayResult } = yield race({
        result: take(sagaKey),
        delayResult: delaySaga(delay)
    })
    
    yield put({
        type: getSagaKeyUnbindSocket(sagaKey)
    })

    if(!result) {
        return { error: 'Время ожидания истекло' }
    }

    return result.payload
}