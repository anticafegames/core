import { createSelector } from 'reselect'
import { Record, OrderedMap, List } from 'immutable'
import { call, put, takeEvery, all, select, take, race } from 'redux-saga/effects'

import { moduleName as module, PREPARE_GAME_START_SOCKET_EVENT } from './constants'
import MainEntity, { iMainEntity } from './entity/main-entity'
import { prepareStartSaga } from './sagas/prepare'
import { iGameDuck } from '../../../ducks/games-common/entity/interface'
import { canStartGame } from './sagas/can-start-game'
import { bindSocketEvents, unbindSocketEvents } from './sagas/bind-socket-events'
import { stopGameSuccess, reconnectGame } from './sagas'
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
        

        default:
            return state

    }
}

/*
*   Selectors
*/



/*
*   Action Creaters
*/



/*
*   Sagas
*/

export function* bindSagas() {

    const sagasEvents = [
        takeEvery(PREPARE_GAME_START_SOCKET_EVENT, prepareStartSaga)
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