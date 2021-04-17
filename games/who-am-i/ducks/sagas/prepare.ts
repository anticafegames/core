import { select, call, put } from 'redux-saga/effects'

import { PREPARE_GAME_START_SUCCESS, socketPrefix, SELECT_NAME_LOADING, SELECT_MY_NAME_SUCCESS, SELECT_NAME_SUCCESS, RANDOM_NAME_LOADING, RANDOM_NAME_SUCCESS } from '../constants'
import { iGameUserResponce, iGameUser } from '../entity/game-user-entity'
import { convertResponceGameUser } from '../entity/converter'
import { CHANGE_ROOM_STATUS } from '../../../../ducks/webrtc-room'
import { showWhoAmIModal } from '../../modal-windows'
import { socketEmit } from '../../../../code/socket/socket-emit'
import Toasts from '../../../../code/alerts/toast'
import { gameStateSelector } from '..'

export function* prepareStartSaga({ payload }: any) {

    const gameUsersResponce: iGameUserResponce[] = payload.users
    const gameUsers: iGameUser[] = yield call(convertResponceGameUser, gameUsersResponce)

    yield put({
        type: CHANGE_ROOM_STATUS,
        payload: { status: 'game' }
    })

    yield put({
        type: PREPARE_GAME_START_SUCCESS,
        payload: { gameUsers }
    })

    yield put(showWhoAmIModal('SelectNameModal'))
}

export function* selectNameEmitSaga({ payload }: any) {
    const { name } = payload

    if(!name.trim()) {
        return Toasts.messageToast('Имя не должно быть пустым');
    }

    yield put({ type: SELECT_NAME_LOADING, payload: { loading: true } })
    yield call(socketEmit, `${socketPrefix}/select-name`, { name })
}

export function* selectNameSocketEventSaga({ payload }: any) {

    const { error, userId, name, nameFilled } = payload

    if(error) {
        return Toasts.messageToast(error)
    }

    if(nameFilled) {
        return yield put({ type: SELECT_MY_NAME_SUCCESS })
    }

    yield put({
        type: SELECT_NAME_SUCCESS,
        payload: { userId, name }
    })
}

export function* randomNameEmitSaga() {

    const gameState = yield select(gameStateSelector)
    if(gameState !== 'prepare') return

    yield put({ type: RANDOM_NAME_LOADING, payload: { loading: true } })
    yield call(socketEmit, `${socketPrefix}/random-name`, {})
}

export function* randomNameSocketEvent({ payload }: any) {

    const { error, result } = payload

    if(error) {
        return Toasts.messageToast(error)
    }

    yield put({
        type: RANDOM_NAME_SUCCESS,
        payload: { name: result }
    })
}