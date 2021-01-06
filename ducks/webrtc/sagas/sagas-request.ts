import { put, select, all, call } from "redux-saga/effects"

import { peersSelector, ADD_PEERS_SUCCESS, ADD_TRACK_SUCCESS, ADD_CHANNEL_SUCCESS, DELETE_PEERS_SUCCEESS, DELETE_ALL_PEERS_SUCCEESS, presenterConnnectionSelector, peerSelector } from ".."
import { infoMessage, todo } from "../../../code/messages"
import { iPeersConnection } from "../entity/peer-connection-entity"
import { closeListenSagaKey as closeListenOnIceCandidateSagaKey } from './onicecandidate'
import { closeListenSagaKey as closeListenTrackSagaKey } from './track'
import { closeListenSagaKey as closeListenStateChangeSagaKey } from './reconnect'

export function* addConnectionSaga({ payload }: any) {
debugger
    const userId: string = payload.userId
    const connection: RTCPeerConnection = payload.connection

    const peerConnection: iPeersConnection = { userId, connection }

    yield put({
        type: ADD_PEERS_SUCCESS,
        payload: { peerConnection }
    })

    infoMessage(`Добавили сооединение. UserId: ${userId}`)
}

export function* addTrackSaga({ payload }: any) {

    const { userId, track } = payload

    yield put({
        type: ADD_TRACK_SUCCESS,
        payload: { userId, track }
    })

    infoMessage(`Добавили трек. UserId: ${userId}`)
}

export function* addChannelSaga({ payload }: any) {

    const { userId, channel } = payload

    yield put({
        type: ADD_CHANNEL_SUCCESS,
        payload: { userId, channel }
    })

    infoMessage(`Добавили channel. UserId: ${userId}`)
}

export function* leavePeerSaga({ payload }: any) {
    
    const { userId } = payload
    let peer = yield select(peerSelector(userId))

    if (peer) {

        yield call(closeConnection, peer)
        yield call(closeWebRTCListeners, userId)

        yield put({
            type: DELETE_PEERS_SUCCEESS,
            payload: { userId }
        })

        infoMessage(`Удалили соединение. UserId: ${userId}`)
    }
}

export function* deleteAllPeersSaga() {

    const peers: iPeersConnection[] = yield select(peersSelector)
    peers.forEach(peer => closeConnection(peer))

    yield all(peers.map(peer => call(closeWebRTCListeners, peer.userId)))

    yield put({
        type: DELETE_ALL_PEERS_SUCCEESS
    })
}

export function closeConnection(connection: iPeersConnection) {
    connection.channel && connection.channel.close()
    connection.track && connection.track.getTracks().forEach(track => track.stop())
    connection.connection && connection.connection.close()
}

export function* closeWebRTCListeners(userId: string) {
    yield put({ type: closeListenOnIceCandidateSagaKey(userId) })
    yield put({ type: closeListenTrackSagaKey(userId) })
    yield put({ type: closeListenStateChangeSagaKey(userId) })
}

