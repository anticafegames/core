import React from 'react'
import { call, fork, select, put } from "redux-saga/effects"

import { socketEmit, socketEmitAndWaitData } from '../../../code/socket/socket-emit'
import { todo, infoMessage, errorMessage } from '../../../code/messages'
import { CLOSE_LOCAL_STREAM_REQUEST, DELETE_ALL_PEERS_SUCCEESS, DELETE_ALL_PEERS_REQUEST } from '../../webrtc'
import { waitBindSocket, bindSocketEvents, getSagaKeyUnbindSocket } from '../../../code/socket/bind-socket-events-helper'
import { logInSaga, userIdSelector, isAuthorizedSelector } from '../../authentication'
import VKApi from '../../../code/api/vk-api/vk-api'
import LocalStorage from '../../../code/local-storage'
import Auth from '../../../code/api/vk-api/vk-api-helper'
import createLocalStreamSaga, { waitLocalStream, } from '../../webrtc/sagas/local-stream'
import { querySelector, hashSelector } from '../../router'
import { showGlobalPreloader, getHidePreloaderSagaKey, hidePreloader } from '../../global-preloader'
import { ADD_ROOM_PEER, LEAVE_ROOM_PEER, LEAVE_FROM_ROOM_SUCCESS, ROOM_CONNECT_SOCKET_EVENT, ROOM_CONNECT_SUCCESS, ROOM_INFO_SOCKET_EVENT, roomUsersSelector } from ".."
import Toasts from "../../../code/alerts/toast"
import { iSocketAction } from "../../socket/entity/interface"
import { iShortRoom } from "../../webrtc-rooms/entity/rooms-entity"
import { connectToRoom } from "../action-creaters/connect"
import Modals from "../../../../core/code/modals"
import { reconnectGame } from '../../games-common/sagas/start-game'
import Router from '../../../code/common/router'

import { iRoomPeer, iPeerRoomSocketResponse } from '../entity/room-peer-entity'

declare var window: any

export function* roomConnectSocketRequestSaga({ payload }: any) {

    try {
        
        yield fork(showGlobalPreloader, 'checkReconnectRoom', 'connet_room', 0)
        
        const auth = yield call(logInSaga)

        if (!auth) {
            Toasts.messageToast('Ошибка при авторизации')
            throw new Error()
        }
        
        const localStream = yield call(createLocalStreamSaga)
        
        if (!localStream) {
            Toasts.messageToast('Ошибка при подключении к камере')
            throw new Error()
        }

        const { mode, params } = payload

        params.isDebug = window.location.host === 'localhost:3000'
        
        const data = { mode, params }
        yield call(socketEmit, 'room_join', data, true)

    } catch {
        yield call(hidePreloader, 'connet_room')
    }
}

export function* roomConnectSocketSuccessSaga({ payload }: any) {

    let { error, result, mode } = payload
    
    if (!error) {
        
        const { room, roomToken, game } = result
        
        if (mode === 'knock') {

            const localStream = yield call(createLocalStreamSaga)

            if (!localStream) {
                Toasts.messageToast('Ошибка при подключении к камере')
                yield leaveFromRoomSaga()
            }
        }

        const users = yield call(VKApi.loadRoomPeers, room.users)
        room.users = users

        const userId = yield select(userIdSelector)
        room.isOwner = userId === room.ownerId
        
        if(room.status === 'game' && game) {
            yield call(reconnectGame, game)
        }
        
        yield put({
            type: ROOM_CONNECT_SUCCESS,
            payload: { room }
        })

        LocalStorage.setObjectToStorage(roomToken, 'room-token')

        Router.replace(isNative ? 'RoomScreen' : '/room')
    }
    else {

        if (mode === 'connect') {
            Toasts.messageToast(error)
        }

        yield put({ type: CLOSE_LOCAL_STREAM_REQUEST })
    }

    yield call(hidePreloader, 'connet_room')
}

export function* knockOnRoomEmitSaga({ payload }: any) {

    const { roomId } = payload

    const auth = yield call(logInSaga)

    if (!auth) {
        Toasts.messageToast('Ошибка при авторизации')
        return
    }

    const data = { roomId }
    yield call(socketEmit, 'room_knock_on_room', data, true)

    Toasts.messageToast('Отправлен запрос на присоединение к комнате')
}

export function* roomJoinSocketEventSaga({ payload }: any) {

    const { userId: id, vkId } = payload

    const roomPeers: iRoomPeer[] = yield select(roomUsersSelector)
    if (roomPeers.some(peer => peer.id === id)) return 

    const [user] = (yield call(VKApi.loadRoomPeers, [{ id, vkId }])) as any[]

    if (!user) return

    yield put({
        type: ADD_ROOM_PEER,
        payload: { user }
    })
}

export function* leavePeerRoomSocketEventSaga({ payload }: any) {

    const { userId, removeRoomPeer } = payload

    if (removeRoomPeer) {

        yield put({
            type: LEAVE_ROOM_PEER,
            payload: { userId }
        })
    }
}

export function* leaveFromRoomSaga() {

    const data = {}
    yield call(socketEmit, 'leave', data)

    yield put({
        type: LEAVE_FROM_ROOM_SUCCESS
    })

    todo('Наверное нужно закрывать соединение, а не просто удалять из списка', 'leavePeerSaga')

    yield put({
        type: DELETE_ALL_PEERS_REQUEST
    })

    infoMessage(`Удаляем всех пиров.`)

    yield put({ type: CLOSE_LOCAL_STREAM_REQUEST })

    LocalStorage.clearStorage('room-token')
}

export function* kickFromRoomSaga() {

    yield put({
        type: LEAVE_FROM_ROOM_SUCCESS
    })

    yield put({
        type: DELETE_ALL_PEERS_REQUEST
    })

    infoMessage(`Удаляем всех пиров.`)

    yield put({ type: CLOSE_LOCAL_STREAM_REQUEST })
}

export function* checkReconnectRoom() {

    const hash: string = ''//yield select(hashSelector)
    
    if (/^#roomid=.+/.test(hash)) {
        yield roomConnectByLink(hash)
        return
    }

    const roomToken = yield call(LocalStorage.getObjectFromStorage, 'room-token')
    if (!roomToken) return

    yield fork(showGlobalPreloader, 'checkReconnectRoom', 'connet_room', 0, true)

    const error = function* (message: string) {
        Toasts.messageToast(message)
        return yield call(hidePreloader, 'connet_room')
    }

    yield call(Auth.waitAuthentication, false, false)
    if (!(yield select(isAuthorizedSelector))) {
        return yield console.log('Ошибка аутентификации')
    }

    if (!(yield call(createLocalStreamSaga))) {
        return yield error('Не смогли подключиться к камере')
    }

    yield call(waitBindSocket, ROOM_CONNECT_SOCKET_EVENT)
    yield call(socketEmit, 'reconnet_room', { roomToken }, true)
}

export function* roomConnectByLink(hash: string) {

    const [,roomId] = hash.split('roomid=')
    
    yield fork(showGlobalPreloader, 'connectRoomByLink', 'connectRoomByLink', 0, true)

    const { error, result } = yield call(socketEmitAndWaitData, 'room_info', { roomId }, false, ROOM_INFO_SOCKET_EVENT)

    if (error) {
        yield call(hidePreloader, 'connectRoomByLink')
        infoMessage(`Не удалось получить информацию о комнате: ${error}`)
        return
    }

    const room: iShortRoom = result.room

    if (room!.openRoom) {
        yield put(connectToRoom({ roomId: room.id }))
    } else {
        yield put(Modals.showRoomJoinFormPageModal(room))
    }

    yield call(hidePreloader, 'connectRoomByLink')
}