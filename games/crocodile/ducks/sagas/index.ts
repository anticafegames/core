import { put, call, fork, select } from 'redux-saga/effects'
import { STOP_GAME_SUCCESS, RECONNECT_GAME_SUCCESS, socketPrefix } from '../constants'
import { iReconnectGameState } from '../../../../ducks/games-common/entity/interface'
import { socketEmit } from '../../../../code/socket/socket-emit'
import { closeElement } from '../../../../ducks/modal/index'
import { bindSocketEvents } from './bind-socket-events'

export function* stopGameSuccess() {

    
}

export function* reconnectGame(reconnectState: iReconnectGameState) {
    
    
}
