import { createSelector } from 'reselect'
import { Record, OrderedMap, List } from 'immutable'
import { call, put, takeEvery, all, select, take, race } from 'redux-saga/effects'

import {
    moduleName as module, PREPARE_GAME_START_SUCCESS,
    PREPARE_GAME_START_SOCKET_EVENT, STOP_GAME_SUCCESS,
    RECONNECT_GAME_SUCCESS, SELECT_NAME_REQUEST,
    SELECT_NAME_SOCKET_EVENT, SELECT_NAME_LOADING, SELECT_MY_NAME_SUCCESS, SELECT_NAME_SUCCESS, START_GAME_REQUEST, START_GAME_SOCKET_EVENT, START_GAME_SUCCESS, SHOW_NAME_REQUEST, SHOW_NAME_SOCKET_EVENT, SHOW_MY_NAME_SUCCESS, SHOW_NAME_SUCCESS, RANDOM_NAME_LOADING, RANDOM_NAME_SUCCESS, RANDOM_NAME_REQUEST, RANDOM_NAME_SOCKET_EVENT
} from './constants'
import MainEntity, { iMainEntity } from './entity/main-entity'
import { prepareStartSaga, randomNameEmitSaga, randomNameSocketEvent, selectNameEmitSaga, selectNameSocketEventSaga } from './sagas/prepare'
import { iGameUser } from './entity/game-user-entity'
import { sortBuyOrdernum } from './entity/converter'
import { iGameDuck } from '../../../ducks/games-common/entity/interface'
import { canStartGame } from './sagas/can-start-game'
import { bindSocketEvents, unbindSocketEvents } from './sagas/bind-socket-events'
import { stopGameSuccess, reconnectGame } from './sagas'
import { startGameEmitSaga, startGameSocketSaga, showNameEmitSaga, showNameSocketSaga } from './sagas/game'
import { gameSelector, STOP_GAME_SAGAS } from '../../../ducks/games-common'

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

        case PREPARE_GAME_START_SUCCESS:
            return state
                .prepareStart(payload.gameUsers)

        case START_GAME_SUCCESS:
            return state
                .startGame()

        case STOP_GAME_SUCCESS:
            return state
                .stopGame()

        case RECONNECT_GAME_SUCCESS:
            return state
                .reconnectGame(payload.state)

        case SELECT_MY_NAME_SUCCESS:
            return state
                .filledMyName()

        case SELECT_NAME_SUCCESS:
            return state
                .filledName(payload.userId, payload.name)

        case RANDOM_NAME_SUCCESS: 
            return state
                .selectRandomName(payload.name)

        case SHOW_MY_NAME_SUCCESS:
            return state
                .showMyName(payload.name)

        case SHOW_NAME_SUCCESS:
            return state
                .showName(payload.userId)

        case SELECT_NAME_LOADING:
            return state
                .selectNameLoading(payload.loading)

        case RANDOM_NAME_LOADING:
            return state
                .randomNameLoading(payload.loading)

        default:
            return state

    }
}

/*
*   Selectors
*/


export const gameUsersSelector = createSelector(gameSelector, state => ((state.gameUsers as List<any>).toJS() as iGameUser[]).sort(sortBuyOrdernum))
export const randomNameSelector = createSelector(gameSelector, state => state.randomName)
export const fillNameLoadingSelector = createSelector(gameSelector, state => state.fillNameLoading)
export const randomNameLoadingSelector = createSelector(gameSelector, state => state.randomNameLoading)
export const gameStateSelector = createSelector(gameSelector, state => state.gameState)

/*
*   Action Creaters
*/

export function selectName(name: string) {
    return {
        type: SELECT_NAME_REQUEST,
        payload: { name }
    }
}

export function startGame() {
    return { type: START_GAME_REQUEST }
}

export function showName(userId: string) {
    return {
        type: SHOW_NAME_REQUEST,
        payload: { userId }
    }
}

export function selectRandomName() {
    return {
        type: RANDOM_NAME_REQUEST
    }
}

/*
*   Sagas
*/

export function* bindSagas() {

    const sagasEvents = [
        takeEvery(PREPARE_GAME_START_SOCKET_EVENT, prepareStartSaga),
        takeEvery(SELECT_NAME_SOCKET_EVENT, selectNameSocketEventSaga),
        takeEvery(RANDOM_NAME_REQUEST, randomNameEmitSaga),
        takeEvery(START_GAME_SOCKET_EVENT, startGameSocketSaga),
        takeEvery(SHOW_NAME_SOCKET_EVENT, showNameSocketSaga),
        takeEvery(RANDOM_NAME_SOCKET_EVENT, randomNameSocketEvent),

        takeEvery(SELECT_NAME_REQUEST, selectNameEmitSaga),
        takeEvery(START_GAME_REQUEST, startGameEmitSaga),
        takeEvery(SHOW_NAME_REQUEST, showNameEmitSaga)
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