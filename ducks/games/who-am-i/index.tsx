import { createSelector } from 'reselect'
import { Record, OrderedMap, List } from 'immutable'
import { delay, eventChannel } from 'redux-saga'
import { call, put, takeEvery, all, select, take } from 'redux-saga/effects'

import { moduleName as module, PREPARE_GAME_START_SUCCESS, 
    PREPARE_GAME_START_SOCKET_EVENT, STOP_GAME_SUCCESS, 
    RECONNECT_GAME_SUCCESS, SELECT_NAME_REQUEST, 
    SELECT_NAME_SOCKET_EVENT, SELECT_NAME_LOADING, SELECT_MY_NAME_SUCCESS, SELECT_NAME_SUCCESS, START_GAME_REQUEST, START_GAME_SOCKET_EVENT, START_GAME_SUCCESS, SHOW_NAME_REQUEST, SHOW_NAME_SOCKET_EVENT, SHOW_MY_NAME_SUCCESS, SHOW_NAME_SUCCESS } from './constants'
import MainEntity, { iMainEntity } from './entity/main-entity'
import { prepareStartSaga, selectNameEmitSaga, selectNameSocketEventSaga } from './sagas/prepare'
import { iGameUser } from './entity/game-user-entity'
import { sortBuyOrdernum } from './entity/converter'
import { iGame } from '../../games-common/entity/interface'
import { canStartGame } from './sagas/can-start-game'
import { bindSocketEvents, unbindSocketEvents } from './sagas/bind-socket-events'
import { stopGameSuccess, reconnectGame } from './sagas'
import { startGameEmitSaga, startGameSocketSaga, showNameEmitSaga, showNameSocketSaga } from './sagas/game'

/*
*   Contstants 
*/

export const moduleName = module

/*
*   Reducer
*/

export default function reducer(state = new MainEntity(), action: any) {
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

        case SHOW_MY_NAME_SUCCESS:
            return state
                .showMyName(payload.name)

        case SHOW_NAME_SUCCESS:
            return state
                .showName(payload.userId)

        case SELECT_NAME_LOADING: 
            return state
                .selectNameLoading(payload.loading)

        default:
            return state

    }
}

/*
*   Selectors
*/

export const stateSelector = (state: any) => state[moduleName] as iMainEntity
export const gameUsersSelector = createSelector(stateSelector, state => ((state.gameUsers as List<any>).toJS() as iGameUser[]).sort(sortBuyOrdernum))
export const fillNameLoadingSelector = createSelector(stateSelector, state => state.fillNameLoading)
export const gameStateSelector = createSelector(stateSelector, state => state.gameState)

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

/*
*   Sagas
*/

export function* saga() {
    yield all([
        takeEvery(PREPARE_GAME_START_SOCKET_EVENT, prepareStartSaga),
        takeEvery(SELECT_NAME_SOCKET_EVENT, selectNameSocketEventSaga),
        takeEvery(START_GAME_SOCKET_EVENT, startGameSocketSaga),
        takeEvery(SHOW_NAME_SOCKET_EVENT, showNameSocketSaga),

        takeEvery(SELECT_NAME_REQUEST, selectNameEmitSaga),
        takeEvery(START_GAME_REQUEST, startGameEmitSaga),
        takeEvery(SHOW_NAME_REQUEST, showNameEmitSaga)
    ])
}

/*
* Game
*/

export const game: iGame = { canStartGame, bindSocketEvents, unbindSocketEvents, stopGame: stopGameSuccess, reconnectGame }