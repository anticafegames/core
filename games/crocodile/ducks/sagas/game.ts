import { put, call, fork, select } from 'redux-saga/effects'
import { STOP_GAME_SUCCESS, RECONNECT_GAME_SUCCESS, socketPrefix, START_GAME_SUCCESS, CHANGE_TIMER, SET_ROUND_DATA } from '../constants'
import { iReconnectGameState } from '../../../../ducks/games-common/entity/interface'
import { socketEmit } from '../../../../code/socket/socket-emit'
import { closeElement } from '../../../../ducks/modal/index'
import { bindSocketEvents } from './bind-socket-events'
import Toasts from '../../../../code/alerts/toast'
import { convertResponceTeams, settingsToRequest } from '../entity/converter'
import { settings } from 'cluster'

export function* startGameEmitSaga(): any {
    const data = yield call(settingsToRequest)
    yield call(socketEmit, `${socketPrefix}/start-game`, data)
}

export function* startGameSocketSaga({ payload }: any): any {

    const { error, result } = payload
    
    if(error) {
        return Toasts.messageToast(error)
    }

    const { gameData, hostTeam, hostUserData } = result
    let { state, settings, teams } = gameData

    teams = yield call(convertResponceTeams, teams)

    yield put({ type: START_GAME_SUCCESS, payload: { state, settings, teams } })
    yield put({ type: SET_ROUND_DATA, payload: { hostTeam, hostUserData } })
    yield put(closeElement())
}