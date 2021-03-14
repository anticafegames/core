import { appName, gamePrefix } from '../../config/app-config'
import { createSelector } from 'reselect'
import { Record, OrderedMap, List } from 'immutable'
import { call, put, takeEvery, all, select, take } from 'redux-saga/effects'

import { bindSocketEvents } from '../../code/socket/bind-socket-events-helper'
import { iSocketResult, iSocketAction } from '../socket/entity/interface'
import { todo } from '../../code/messages'
import { ROOM_CONNECT_REQUEST } from '../webrtc-room'
import MainEntity, { iMainEntity } from './entity/main-entity'
import { gameKey } from './entity/interface'
import { prepareGameSaga, readyStartSaga, iReadySaga, cancelPrepareGameSocketEventSaga, cancelPrepareGameSaga, endPrepareGameSaga, stopGameEmitSaga, stopGameSaga } from './sagas/start-game'
import { addGameDataSaga } from './sagas/add-game-data'

/*
*   Contstants 
*/

export const moduleName = 'game-common'
export const socketPrefix = 'game-common'

const prefix = `${appName}/${moduleName}`

export const START_PREPARE_GAME_REQUEST = `${prefix}/START_PREPARE_GAME_REQUEST`

export const WAIT_READY_START = `${prefix}/WAIT_READY_START`
export const WAIT_READY_STOP = `${prefix}/WAIT_READY_STOP`

export const I_READY_REQUEST = `${prefix}/I_AM_READY_REQUEST`
export const I_READY_SUCCESS = `${prefix}/I_AM_READY_SUCCESS`

export const USER_IS_READY = `${prefix}/USER_IS_READY`

export const READY_START_SOCKET_EVENT = `${prefix}/READY_START_SOCKET_EVENT`
export const USER_IS_READY_SOCKET_EVENT = `${prefix}/USER_IS_READY_SOCKET_EVENT`

export const CANCEL_PREPARE_GAME_REQUEST = `${prefix}/CANCEL_PREPARE_GAME_REQUEST`
export const CANCEL_PREPARE_GAME_SOCKET_EVENT = `${prefix}/CANCEL_PREPARE_GAME_SOCKET_EVENT`

export const END_PREPARE_GAME_SOCKET_EVENT = `${prefix}/END_PREPARE_GAME_SOCKET_EVENT`

export const STOP_GAME_REQUEST = `${prefix}/STOP_GAME_REQUEST`
export const STOP_GAME_SOCKET_EVENT = `${prefix}/STOP_GAME_SOCKET_EVENT`
export const STOP_GAME_SUCCESS = `${prefix}/STOP_GAME_SUCCESS`

export const RECONNECT_GAME = `${prefix}/RECONNECT_GAME`

export const CREATE_GAME_ENTITY = `${prefix}/CREATE_GAME_ENTITY`
export const STOP_GAME_SAGAS = `${prefix}/STOP_GAME_SAGAS`

export const ADD_GAME_DATA_REQUEST = `${prefix}/ADD_GAME_DATA_REQUEST`

/*
*   Reducer
*/

export default function reducer(state = new MainEntity(), action: any) {

    const type = action.type
    const payload = action.payload

    switch (type) {

        case CREATE_GAME_ENTITY: 
            return state
                .createGameEntity(payload.gameKey, payload.game, payload.reducer)

        case WAIT_READY_START:
            return state
                .waitReadyStart(payload.readyUsers, payload.usersCount)

        case USER_IS_READY:
            return state
                .userIsReady(payload.userId)

        case WAIT_READY_STOP: 
            return state
                .waitReadyStop()

        case STOP_GAME_SUCCESS: 
            return state
                .stopGame()

    }

    if(type.startsWith(gamePrefix)) {
        return state.gameReducer(action)
    }

    return state
}

/*
*   Selectors
*/

export const stateSelector = (state: any) => state[moduleName] as MainEntity

export const readyUsersSelector = createSelector(stateSelector, state => state.readyUsers as string[])

export const gameKeySelector = createSelector(stateSelector, state => state.gameCreated && state.gameEntity.gameKey)
export const gameCreated = createSelector(stateSelector, state => state.gameCreated)
export const gameSelector = createSelector(stateSelector, state => state.gameCreated && state.gameEntity.game)

/*
*   Action Creaters
*/

export function prepareGame(gameKey: gameKey) {
    return {
        type: START_PREPARE_GAME_REQUEST,
        payload: { gameKey }
    }
}

export function stopGame() {
    return {
        type: STOP_GAME_REQUEST
    }
}

export function iReady() {
    return { type: I_READY_REQUEST }
}

export function cancelPrepareGame() {
    return { type: CANCEL_PREPARE_GAME_REQUEST }
}

export function addGameData(gameKey: gameKey, data: any) {
    return {
        type: ADD_GAME_DATA_REQUEST,
        payload: { gameKey, data }
    }
}

/*
*   Sagas
*/

export const socketActions: iSocketAction[] = [
    {
        socketKey: 'game-common/ready-start',
        sagaKey: READY_START_SOCKET_EVENT
    },
    {
        socketKey: 'game-common/user-is-ready',
        sagaKey: USER_IS_READY
    },
    {
        socketKey: 'game-common/cancel-prepare-game',
        sagaKey: CANCEL_PREPARE_GAME_SOCKET_EVENT
    },
    {
        socketKey: 'game-common/end-prepare-game',
        sagaKey: END_PREPARE_GAME_SOCKET_EVENT
    },
    {
        socketKey: 'game-common/stop-game',
        sagaKey: STOP_GAME_SOCKET_EVENT
    }
]

export function* saga() {
    yield all([
        bindSocketEvents(socketActions),
        takeEvery(CANCEL_PREPARE_GAME_SOCKET_EVENT, cancelPrepareGameSocketEventSaga),
        takeEvery(END_PREPARE_GAME_SOCKET_EVENT, endPrepareGameSaga),
        takeEvery(STOP_GAME_SOCKET_EVENT, stopGameSaga),

        takeEvery(START_PREPARE_GAME_REQUEST, prepareGameSaga),
        takeEvery(CANCEL_PREPARE_GAME_REQUEST, cancelPrepareGameSaga),
        takeEvery(READY_START_SOCKET_EVENT, readyStartSaga),
        takeEvery(I_READY_REQUEST, iReadySaga),
        takeEvery(STOP_GAME_REQUEST, stopGameEmitSaga),

        takeEvery(ADD_GAME_DATA_REQUEST, addGameDataSaga)
    ])
}