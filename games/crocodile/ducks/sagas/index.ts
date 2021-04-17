import { put, call, fork, select } from 'redux-saga/effects'
import { STOP_GAME_SUCCESS, RECONNECT_GAME_SUCCESS, socketPrefix, START_GAME_SUCCESS } from '../constants'
import { iReconnectGameState } from '../../../../ducks/games-common/entity/interface'
import { socketEmit } from '../../../../code/socket/socket-emit'
import { closeElement } from '../../../../ducks/modal/index'
import { bindSocketEvents } from './bind-socket-events'
import Toasts from '../../../../code/alerts/toast'
import { iReconnectStateResponce } from '../entity/interface'
import { convertReconnectStateResponce } from '../entity/converter'
import { showCrocodileModal } from '../../modal-windows'

export function* stopGameSuccess() {

    
}

export function* reconnectGame(reconnectState: iReconnectGameState) {
    
    const stateResponse: iReconnectStateResponce = reconnectState.state
    const state = yield call(convertReconnectStateResponce, stateResponse)
    
    yield put({
        type: RECONNECT_GAME_SUCCESS,
        payload: state
    })
    
    if(state.state === 'prepare') {
        yield put(showCrocodileModal('PrepareGame'))
    }
}
