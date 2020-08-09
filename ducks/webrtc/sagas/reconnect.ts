import { eventChannel } from 'redux-saga'
import { delay } from 'redux-saga/effects'

import { leavePeerSaga } from './sagas-request'
import createOffer from './create-offer'
import { roomSelector } from '../../webrtc-room'
import { select, call, fork, race, take } from 'redux-saga/effects'
import { iRoomPeer } from '../../webrtc-room/entity/room-peer-entity'
import Toasts from '../../../code/alerts/toast'
import { getSocketResult, webrtcSocketEmit } from '../../../code/webrtc'
import { infoMessage } from '../../../code/messages'
import { iRoom } from '../../webrtc-room/entity/room-entity'
import { iPeersConnection } from '../entity/peer-connection-entity'
import { peersSelector } from '..'
import { appName } from '../../../config/app-config'
import { reconnectMode } from '../entity/interface'

export function* reconnectTimer(userId: string, connection: RTCPeerConnection) {

    //Почему-то не все устройства подключаются с первого раза, точнее не подключаются яблочники. Если в течении 5 секунд не подключились, то пробуем ещё раз
    yield call(delay, 10000)

    const iceConnectionState = connection.iceConnectionState
    const iceGatheringState = connection.iceGatheringState

    if (iceConnectionState !== "connected" || iceGatheringState !== 'complete') {
        yield call(reconnectConnectionSender, userId)
    } else {
        yield fork(listenChangeState, userId, connection)
    }
}

export function* reconnectConnectionSender(userId: string) {

    const peers: iPeersConnection[] = yield select(peersSelector)
    const peer = peers.find(item => item.userId === userId)
    const room: iRoom = yield select(roomSelector)

    if (!peer || !room) {
        return
    }

    const users: iRoomPeer[] = room.users as any
    const user = users && users.find(user => user.id === userId)

    infoMessage(`Неудалось установить соединение с игроком userID: ${userId}. Переподключаемся`, 'Sender')

    if (user) {
        Toasts.messageToast(`Неудалось установить соединение с игроком: ${user.first_name} ${user.last_name}. Пробуем переподключиться.`)
    }

    yield call(leavePeerSaga, { payload: { userId } })

    const data = getSocketResult('reconnect', userId, { mode: 'connecting' })
    yield call(webrtcSocketEmit, data)
}

export function* reconnectConnectionRecever(userId: string, mode: reconnectMode) {

    const peers: iPeersConnection[] = yield select(peersSelector)
    const peer = peers.find(item => item.userId === userId)

    const room: iRoom = yield select(roomSelector)

    if (!room || !peer) {
        return
    }

    infoMessage(`${mode == 'connecting' ? 'Неудалось установить' : 'Потеряно' } соединение с игроком userID: ${userId}. Переподключаемся`, 'Recever')

    const users: iRoomPeer[] = room.users as any
    const user = users && users.find(user => user.id === userId)

    if (user) {
        Toasts.messageToast(`${mode == 'connecting' ? 'Неудалось установить' : 'Потеряно' } соединение с игроком: ${user.first_name} ${user.last_name}. Пробуем переподключиться.`)
    }

    yield call(leavePeerSaga, { payload: { userId } })
    yield call(createOffer, userId)
}

export function* listenChangeState(userId: string, connection: RTCPeerConnection) {

    const channel = yield eventChannel((emit: any) => {
        connection.oniceconnectionstatechange = emit(true)
        return () => { connection.oniceconnectionstatechange = null }
    })

    yield fork(_listenChangeState, channel, userId, connection)
}

export function* _listenChangeState(channel: any, userId: string, connection: RTCPeerConnection) {

    while (true) {

        const { channelEvent, channelClose } = yield race({
            channelEvent: take(channel),
            channelClose: take(closeListenSagaKey(userId))
        })

        if (!channelEvent) {
            infoMessage(`Закрыли канал OnTrack userId: ${userId}`)
            return yield call(channel.close)
        }

        const iceConnectionState = connection.iceConnectionState

        if (iceConnectionState === "failed") {

            const room: iRoom = yield select(roomSelector)

            if (!room) {
                return
            }

            const users: iRoomPeer[] = room.users as any
            const user = users && users.find(user => user.id === userId)

            infoMessage(`Потеряно соединение с игроком: userID: ${userId}. Переподключаемся`)

            if(user) {
                Toasts.messageToast(`Потеряно соединение с игроком: ${user.first_name} ${user.last_name}. Пробуем переподключиться.`)
            }

            const data = getSocketResult('reconnect', userId, { mode: 'stateChange' })
            yield call(webrtcSocketEmit, data)
        }
    }
}

export const closeListenSagaKey = (userId: string) => `${appName}/webrtc/UNBIND_WEBRTC_LISTEN_CHANGE_STATE_${userId}`