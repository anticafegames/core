import { eventChannel } from 'redux-saga'
import { delay, put } from 'redux-saga/effects'

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
import { peersSelector, presenterConnnectionSelector, peerSelector } from '..'
import { appName } from '../../../config/app-config'
import { reconnectMode } from '../entity/interface'

export function* reconnectTimer(userId: string, connection: RTCPeerConnection) {

    yield fork(listenChangeState, userId, connection)

    //Почему-то не все устройства подключаются с первого раза, точнее не подключаются яблочники. Если в течении 5 секунд не подключились, то пробуем ещё раз
    const { timer, channelClose } = yield race({
        timer: delay(10000),
        channelClose: take(closeListenSagaKey(userId))
    })

    if(timer) {

        const iceConnectionState = connection.iceConnectionState
        const iceGatheringState = connection.iceGatheringState

        if (iceConnectionState !== "connected" || iceGatheringState !== 'complete') {
            yield call(reconnectConnectionSender, userId)
        }
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

    infoMessage(`Не удалось установить соединение с игроком userID: ${userId}. Переподключаемся`, 'Sender')

    if (user) {
        Toasts.messageToast(`Не удалось установить соединение с игроком: ${user.first_name} ${user.last_name}. Пробуем переподключиться.`)
    }

    yield call(leavePeerSaga, { payload: { userId } })

    const data = getSocketResult('reconnect', userId, { mode: 'connecting' })
    yield call(webrtcSocketEmit, data)
}

export function* reconnectConnectionRecever(userId: string, mode: reconnectMode) {

    const room: iRoom = yield select(roomSelector)

    if (!room) {
        return
    }

    infoMessage(`${mode == 'connecting' ? 'Не удалось установить' : 'Потеряно'} соединение с игроком userID: ${userId}. Переподключаемся`, 'Recever')

    const users: iRoomPeer[] = room.users as any
    const user = users && users.find(user => user.id === userId)

    let peer = yield select(peerSelector(userId))

    if (peer && userId !== 'presenter') {

        if (user) {
            Toasts.messageToast(`${mode == 'connecting' ? 'Не удалось установить' : 'Потеряно'} соединение с игроком: ${user.first_name} ${user.last_name}. Пробуем переподключиться.`)
        }
    }

    yield call(leavePeerSaga, { payload: { userId } })
    yield call(createOffer, userId)
}

export function* listenChangeState(userId: string, connection: RTCPeerConnection) {

    const channel = yield eventChannel((emit: any) => {
        connection.oniceconnectionstatechange = emit(true)
        connection.onconnectionstatechange = emit(true)
        connection.onsignalingstatechange = emit(true)
        return () => { 
            connection.oniceconnectionstatechange = null
            connection.onconnectionstatechange = null
            connection.onsignalingstatechange = null
        }
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
        const connectionState = connection.connectionState
        const signallingState = connection.signalingState
        
        if (iceConnectionState === 'failed' || connectionState === 'failed' || signallingState === 'closed') {
            
            const room: iRoom = yield select(roomSelector)

            if (!room) {
                return
            }

            yield put({ type: closeListenSagaKey(userId) })

            const users: iRoomPeer[] = room.users as any
            const user = users && users.find(user => user.id === userId)

            infoMessage(`Потеряно соединение с игроком: userID: ${userId}. Переподключаемся`)

            if (user) {
                Toasts.messageToast(`Потеряно соединение с игроком: ${user.first_name} ${user.last_name}. Пробуем переподключиться.`)
            }

            const data = getSocketResult('reconnect', userId, { mode: 'stateChange' })
            yield call(webrtcSocketEmit, data)
        }
    }
}

export const closeListenSagaKey = (userId: string) => `${appName}/webrtc/UNBIND_WEBRTC_LISTEN_CHANGE_STATE_${userId}`