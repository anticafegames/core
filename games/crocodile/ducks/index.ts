import { createSelector } from 'reselect'
import { Record, OrderedMap, List } from 'immutable'
import { call, put, takeEvery, all, select, take, race } from 'redux-saga/effects'

import * as Contstants from './constants'
import { moduleName as module } from './constants'
import MainEntity, { iMainEntity } from './entity/main-entity'
import { addTeamEmitSaga, addTeamSocketEvent, loadPacksEmitSaga, prepareStartSaga, changeSettingsSaga, changeTeamEmitSaga, deleteTeamSagaEmit, deleteTeamSocketEvent } from './sagas/prepare'
import { iGameDuck } from '../../../ducks/games-common/entity/interface'
import { canStartGame } from './sagas/can-start-game'
import { bindSocketEvents, unbindSocketEvents } from './sagas/bind-socket-events'
import { stopGameSuccess, reconnectGame } from './sagas'
import { gameSelector, STOP_GAME_SAGAS } from '../../../ducks/games-common'
import { startGameEmitSaga, startGameSocketSaga } from './sagas/game'
import { iTeam } from './entity/team-entity'
import { iSettings } from './entity/settings-entity'
import { iSettingsParams } from './entity/settings-params-entity'
import { startRoundEmitSaga, startRoundSocketEvent } from './sagas/round'
import RoundEntity, { iRound } from './entity/round-entity'
import { iGameState } from './entity/interface'
import { iGameUser } from '../../who-am-i/ducks/entity/game-user-entity'

/*
*   Contstants 
*/

export const moduleName = module

/*
*   Reducer
*/

export const reducer = (state = new MainEntity(), action: any) => {
    const { type, payload } = action

    switch (type) {

        case Contstants.PREPARE_GAME_START_SUCCESS:
        case Contstants.START_GAME_SUCCESS:
            return state.updateGameData(payload)

        case Contstants.RECONNECT_GAME_SUCCESS:
            return state.reconnectGame(payload.state, payload)

        case Contstants.CHANGE_TEAM_REQUEST:
        case Contstants.CHANGE_TEAM_SOCKET_EVENT:
            return state.changeTeam(payload.userId, payload.from, payload.to, payload.index)

        case Contstants.CHANGE_SETTINGS_SUCCESS:
            return state.updateSettings(settings => settings.setParams(payload.settings))

        case Contstants.DELETE_TEAM_SUCCESS:
            return state
                .updateTeamById(payload.toTeam, team => team.addUsers(payload.users))
                .deleteTeam(payload.teamId)

        case Contstants.ADD_TEAM_SUCCESS:
            return state.addTeam(payload.team)

        case Contstants.ADD_TEAM_LOADING:
            return state.addTeamLoading(payload.loading)

        case Contstants.LOAD_PACKS_SUCCESS:
            return state.updateSettings(settings => settings.setPacks(payload))

        case Contstants.SET_ROUND_DATA:
            return state.updateRound(round => round.setRoundData(payload))

        case Contstants.CHANGE_TIMER:
            return state.updateRound(round => round.setTimer(payload.timer))

        case Contstants.LOAD_PACKS_LOADING:
            return state.updateSettings(settings => settings.setPacksLoading(payload.loading))

        case Contstants.TEAM_LOADING:
            return state.updateTeamById(payload.teamId, team => team.teamLoading(payload.loading))

        default:
            return state

    }
}

/*
*   Selectors
*/


export const gameStateSelector = createSelector(gameSelector, (state) => state.state as iGameState)
export const teamsSelector = createSelector(gameSelector, (state) => state.teams.toJS() as iTeam[])
export const addTeamLoadingSelector = createSelector(gameSelector, (state) => state.addTeamloading)
export const settingsSelector = createSelector(gameSelector, (state) => state.settings as iSettings)
export const packsSelector = createSelector(settingsSelector, state => state.packs && state.packs.toJS())
export const packsLoadingSelector = createSelector(settingsSelector, state => state.packsloading)
export const settingsParamsSelector = createSelector(settingsSelector, state => state.params.toJS())
export const teamByIdSelector = (teamId: string) => createSelector(teamsSelector, (state) => state.find(team => team.name === teamId) as iTeam)
export const roundSelector = createSelector(gameSelector, (state) => state.round as iRound)
export const timerSelector = createSelector(roundSelector, (state) => state.timer)

export const hostTeamSelector = createSelector(gameSelector, state => state.round && state.round.hostTeam && state.teams.find((team: iTeam) => team.name === state.round.hostTeam) as iTeam)
export const hostUserSelector = createSelector(gameSelector, state => {

    if (state.round && state.round.hostTeam) {

        const hostTeam = state.teams.find((team: iTeam) => team.name === state.round.hostTeam) as iTeam
        const hostUser = hostTeam && hostTeam.users.find(user => user.userId === state.round.hostUserId)

        return hostUser
    }

    return null
})

export const otherHostUsersSelector = createSelector(gameSelector, state => {

    if (state.round && state.round.hostTeam) {

        const hostTeam = state.teams.find((team: iTeam) => team.name === state.round.hostTeam) as iTeam
        const hostUser = hostTeam && hostTeam.users.filter(user => user.userId !== state.round.hostUserId)

        return hostUser
    }

    return null
})

export const nothostTeamUsersSelector = createSelector(gameSelector, state => {

    const hostTeam = state.round && state.round.hostTeam
    const nothostTeams = state.teams.filter((team: iTeam) => team.name !== hostTeam) as iTeam[]

    return nothostTeams.reduce((current: iGameUser[], team) => {
        current.push(...(team.users as iGameUser[]))
        return current
    }, [])
})

/*
*   Action Creaters
*/

export function changeTeam(userId: string, from: string, to: string, index: number) {
    return {
        type: Contstants.CHANGE_TEAM_REQUEST,
        payload: { userId, from, to, index }
    }
}

export function addTeam() {
    return {
        type: Contstants.ADD_TEAM_REQUEST
    }
}

export function loadPacks() {
    return {
        type: Contstants.LOAD_PACKS_REQUEST
    }
}

export function changeSettings(settings: iSettingsParams) {
    return {
        type: Contstants.CHANGE_SETTINGS_REQUEST,
        payload: { settings }
    }
}

export function deleteTeam(team: string) {
    return {
        type: Contstants.DELETE_TEAM_REQUEST,
        payload: { team }
    }
}

export function startGame() {
    return {
        type: Contstants.START_GAME_REQUEST
    }
}

export function startRound() {
    return {
        type: Contstants.START_ROUND_REQUEST
    }
}

/*
*   Sagas
*/

export function* bindSagas() {

    const sagasEvents = [
        takeEvery(Contstants.PREPARE_GAME_START_SOCKET_EVENT, prepareStartSaga),
        takeEvery(Contstants.START_GAME_SOCKET_EVENT, startGameSocketSaga),
        takeEvery(Contstants.ADD_TEAM_SOCKET_EVENT, addTeamSocketEvent),
        takeEvery(Contstants.DELETE_TEAM_SOCKET_EVENT, deleteTeamSocketEvent),
        takeEvery(Contstants.START_ROUND_SOCKET_EVENT, startRoundSocketEvent),

        takeEvery(Contstants.START_GAME_REQUEST, startGameEmitSaga),
        takeEvery(Contstants.ADD_TEAM_REQUEST, addTeamEmitSaga),
        takeEvery(Contstants.LOAD_PACKS_REQUEST, loadPacksEmitSaga),
        takeEvery(Contstants.CHANGE_SETTINGS_REQUEST, changeSettingsSaga),
        takeEvery(Contstants.CHANGE_TEAM_REQUEST, changeTeamEmitSaga),
        takeEvery(Contstants.DELETE_TEAM_REQUEST, deleteTeamSagaEmit),
        takeEvery(Contstants.START_ROUND_REQUEST, startRoundEmitSaga)
    ]

    yield race({
        saga: all(sagasEvents),
        stopSaga: take(STOP_GAME_SAGAS)
    })
}

/*
* Game
*/

export const game: iGameDuck = { canStartGame, entity: MainEntity, reducer, bindSagas, bindSocketEvents, unbindSocketEvents, stopGame: stopGameSuccess, reconnectGame }