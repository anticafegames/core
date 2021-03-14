import { put, call, fork, select } from 'redux-saga/effects'
import { STOP_GAME_SUCCESS, RECONNECT_GAME_SUCCESS, socketPrefix } from '../constants'
import { iReconnectGameState } from '../../../../ducks/games-common/entity/interface'
import { iReconnectState, iReconnectStateResponce, iGameState } from '../entity/interface'
import { iGameUser } from '../entity/game-user-entity'
import { convertResponceGameUser, convertReconnectStateResponce } from '../entity/converter'
import WhoAmIModals from '../../code/modals'
import { socketEmit } from '../../../../code/socket/socket-emit'
import { closeElement } from '../../../../ducks/modal/index'
import { bindSocketEvents } from './bind-socket-events'
import { gameStateSelector } from '..'

export function* stopGameSuccess() {

    const gameState: iGameState = yield select(gameStateSelector)

    yield put({
        type: STOP_GAME_SUCCESS 
    })

    if(gameState === 'prepare') {
        yield put(closeElement())
    }
}

export function* reconnectGame(reconnectState: iReconnectGameState) {
    
    const stateResponce: iReconnectStateResponce = reconnectState.state
    const state: iReconnectState = yield call(convertReconnectStateResponce, stateResponce)
    
    yield put({
        type: RECONNECT_GAME_SUCCESS,
        payload: { state }
    })
    
    if(state.gameState === 'prepare') {
        yield put(WhoAmIModals.showSelectNameModal())
    }
}
