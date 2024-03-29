import { select, call, put } from 'redux-saga/effects'

import { IAmOwnerSelector } from '../../../../ducks/webrtc-room'
import { socketEmit } from '../../../../code/socket/socket-emit'
import { socketPrefix, START_GAME_SUCCESS, SHOW_MY_NAME_SUCCESS, SHOW_NAME_SUCCESS } from '../constants'
import { closeElement } from '../../../../ducks/modal'
import Toasts from '../../../../code/alerts/toast'

export function* startGameEmitSaga(): any {

    const IAmOwner = yield select(IAmOwnerSelector)

    if(IAmOwner) {
        yield call(socketEmit, `${socketPrefix}/start-game`, {})
    }
}

export function* startGameSocketSaga({ payload }: any) {

    const { error } = payload
    
    if(error) {
        return Toasts.messageToast(error)
    }

    yield put({ type: START_GAME_SUCCESS })
    yield put(closeElement())
}

export function* showNameEmitSaga({ payload }: any) {
    const { userId } = payload
    yield call(socketEmit, `${socketPrefix}/show-name`, { userId })
}

export function* showNameSocketSaga({ payload }: any): any {

    const { userId, name } = payload

    if(name) {
        return yield put({
            type: SHOW_MY_NAME_SUCCESS,
            payload: { name }
        })
    }

    yield put({
        type: SHOW_NAME_SUCCESS,
        payload: { userId }
    })

}