import { call, put, select, fork } from 'redux-saga/effects'

import { gameKey, iReconnectGameState } from '../entity/interface'
import { WAIT_READY_START, USER_IS_READY, WAIT_READY_STOP, gameKeySelector, STOP_GAME_SUCCESS, RECONNECT_GAME } from '..'
import { iRoomPeer } from '../../webrtc-room/entity/room-peer-entity'
import { roomUsersSelector, CHANGE_ROOM_STATUS } from '../../webrtc-room'
import Modals from '../../../../core/code/modals'
import { socketEmit } from '../../../code/socket/socket-emit'
import { infoMessage } from '../../../code/messages'
import { userSelector } from '../../user'
import { iUser } from '../../authentication/entity/auth-user-entity'
import { closeElement } from '../../modal'

import { getGame } from '.'

/*
* Владелец
*/

export function* prepareGameSaga({ payload }: any) {

    const { gameKey } = payload

    if(!(yield call(canStartGame, gameKey))) {
        return
    }

    yield fork(bindGameSocketEvents, gameKey)
    yield checkReadyStart(gameKey)
}

export function* canStartGame(gameKey: gameKey) {
    const game = getGame(gameKey)
    return yield call(game.canStartGame)
}

export function* checkReadyStart(gameKey: gameKey) {

    const user: iUser = yield select(userSelector)
    const roomPeers: iRoomPeer[] = yield select(roomUsersSelector)

    const readyUsers = [user.id]

    yield put({
        type: WAIT_READY_START,
        payload: { usersCount: roomPeers.length + 1, game: gameKey, readyUsers }
    })

    yield put({
        type: CHANGE_ROOM_STATUS,
        payload: { status: 'check-ready' }
    })

    yield put(Modals.showCheckReadyModal())
    yield call(socketEmit, 'game-common/ready-start', { gameKey, readyUsers })
}

export function* stopGameEmitSaga() {
    yield call(socketEmit, 'game-common/stop-game', {})
}

/*
* Не владелец
*/

export function* readyStartSaga({ payload }: any) {
    
    const { gameKey, readyUsers } = payload
    const roomPeers: iRoomPeer[] = yield select(roomUsersSelector)

    yield fork(bindGameSocketEvents, gameKey)

    yield put({
        type: WAIT_READY_START,
        payload: { usersCount: roomPeers.length + 1, game: gameKey, readyUsers }
    })

    yield put({
        type: CHANGE_ROOM_STATUS,
        payload: { status: 'check-ready' }
    })

    yield put(Modals.showCheckReadyModal())
}

export function* iReadySaga() {

    const user: iUser = yield select(userSelector)
    const userId = user.id

    yield put({
        type: USER_IS_READY,
        payload: { userId }
    })

    yield call(socketEmit, 'game-common/user-is-ready', { userId })
}

export function* cancelPrepareGameSaga() {
    yield call(socketEmit, 'game-common/cancel-prepare-game', { })
}

/*
* Общие
*/ 

export function* cancelPrepareGameSocketEventSaga() {

    const gameKey = yield select(gameKeySelector)

    yield put(closeElement())
    yield put({ type: WAIT_READY_STOP })

    yield put({
        type: CHANGE_ROOM_STATUS,
        payload: { status: 'wait' }
    })

    yield bindGameSocketEvents(gameKey, true)
}

export function* bindGameSocketEvents(gameKey: gameKey, unbind: boolean = false) {
    const game = getGame(gameKey)
    const action = unbind ? game.unbindSocketEvents : game.bindSocketEvents

    yield call(action)
}

export function* endPrepareGameSaga() {

    yield put(closeElement())
    yield put({ type: WAIT_READY_STOP })
}

export function* stopGameSaga() {

    const gameKey = yield select(gameKeySelector)

    yield put({
        type: CHANGE_ROOM_STATUS,
        payload: { status: 'wait' }
    })

    yield put({
        type: STOP_GAME_SUCCESS
    })

    const game = getGame(gameKey)
    yield call(game.stopGame)
}

export function* reconnectGame(state: iReconnectGameState) {

    const game = getGame(state.gameKey)

    if(!game.reconnectGame) return null

    yield call(game.reconnectGame, state)
    
    yield put({
        type: RECONNECT_GAME,
        payload: { state }
    })
}

