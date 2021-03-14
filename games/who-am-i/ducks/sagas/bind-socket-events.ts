import { iSocketAction } from '../../../../ducks/socket/entity/interface'
import { socketPrefix, PREPARE_GAME_START_SOCKET_EVENT, SELECT_NAME_SOCKET_EVENT, START_GAME_SOCKET_EVENT, SHOW_NAME_SOCKET_EVENT, RANDOM_NAME_SOCKET_EVENT } from '../constants'
import { bindSocketEvents as bindEvents, getSagaKeyUnbindSocket } from '../../../../code/socket/bind-socket-events-helper'
import { all, call, fork } from 'redux-saga/effects'

const socketActions: iSocketAction[] = [
    {
        socketKey: `${socketPrefix}/prepare-game-start`,
        sagaKey: PREPARE_GAME_START_SOCKET_EVENT
    },
    {
        socketKey: `${socketPrefix}/select-name`,
        sagaKey: SELECT_NAME_SOCKET_EVENT
    },
    {
        socketKey: `${socketPrefix}/start-game`,
        sagaKey: START_GAME_SOCKET_EVENT
    },
    {
        socketKey: `${socketPrefix}/show-name`,
        sagaKey: SHOW_NAME_SOCKET_EVENT
    },
    {
        socketKey: `${socketPrefix}/random-name`,
        sagaKey: RANDOM_NAME_SOCKET_EVENT
    }
] 

export function* bindSocketEvents() {
    return yield call(bindEvents, socketActions)
}

export function* unbindSocketEvents() {
    yield all(socketActions.map(event => call(getSagaKeyUnbindSocket, event.sagaKey)))
}

