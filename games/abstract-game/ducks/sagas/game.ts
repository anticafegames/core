import { put, call, fork, select } from 'redux-saga/effects'
import { STOP_GAME_SUCCESS, RECONNECT_GAME_SUCCESS, socketPrefix, START_GAME_SUCCESS } from '../constants'
import { iReconnectGameState } from '../../../../ducks/games-common/entity/interface'
import { socketEmit } from '../../../../code/socket/socket-emit'
import { closeElement } from '../../../../ducks/modal/index'
import { bindSocketEvents } from './bind-socket-events'
import Toasts from '../../../../code/alerts/toast'

export function* startGameEmitSaga() {
    yield call(socketEmit, `${socketPrefix}/start-game`, {})
}

export function* startGameSocketSaga({ payload }: any) {

    const { error } = payload
    
    if(error) {
        return Toasts.messageToast(error)
    }

    yield put({ type: START_GAME_SUCCESS })
    yield put(closeElement())
}