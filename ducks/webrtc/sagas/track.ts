import { eventChannel } from "redux-saga"
import { select, put, take, call, fork, race } from "redux-saga/effects"

import { localStreamSelector, CREATE_LOCAL_STREAM_SUCCESS, ADD_TRACK_REQUEST, peersSelector } from ".."

import { todo, infoMessage, errorMessage } from "../../../code/messages"
import { iPeersConnection } from "../entity/peer-connection-entity"
import { appName } from "../../../config/app-config"
import Track from '../../../code/webrtc/track'


export function* listenOnTrack(connection: RTCPeerConnection, userId: string) {
    const channel = yield eventChannel((emit: any) => Track.listenOnTrack(connection, emit))
    yield fork(listen, channel, userId)
}

export function* listen(channel: any, userId: string) {

    while (true) {

        const { stream, channelClose } = yield race({
            stream: take(channel),
            channelClose: take(closeListenSagaKey(userId))
        })
        
        if (!stream) {
            infoMessage(`Закрыли канал OnTrack userId: ${userId}`)
            return yield call(channel.close)
        }

        yield call(ontrack, stream, userId)
    }
}

export function* ontrack(track: MediaStream, userId: string) {

    infoMessage(`Добавлен трек userId: ${userId}`)

    if (!track) return

    yield put({
        type: ADD_TRACK_REQUEST,
        payload: { userId, track }
    })
}

export function* addTrack(connection: RTCPeerConnection) {

    let localStream: MediaStream = yield select(localStreamSelector)

    if (!localStream) {
        const { payload } = yield take(CREATE_LOCAL_STREAM_SUCCESS)
        localStream = payload.stream as MediaStream
    }

    Track.addTrack(connection, localStream)
}

export function* changeTracks(stream: MediaStream) {

    const localStream: MediaStream = yield select(localStreamSelector)
    const peers: iPeersConnection[] = yield select(peersSelector)

    const [oldAudioTrack] = localStream.getAudioTracks()
    const [oldVideoTrack] = localStream.getVideoTracks()

    const [newAudioTrack] = stream.getAudioTracks()
    const [newVideoTrack] = stream.getVideoTracks()

    if (newAudioTrack && (!oldAudioTrack || oldAudioTrack.id !== newAudioTrack.id)) {

        oldAudioTrack.stop()
        localStream.removeTrack(oldAudioTrack)

        localStream.addTrack(newAudioTrack)

        peers.forEach(peer => {
            errorMessage('changeTracks Нужно сделать DI')
            const sender = peer.connection && peer.connection!.getSenders().find(item => (item.track && item.track.id) === oldAudioTrack.id)
            
            if(sender) {
                sender.replaceTrack(newAudioTrack)
            }
        })
    }

    if (newVideoTrack && (!oldVideoTrack || oldVideoTrack.id !== newVideoTrack.id)) {

        oldVideoTrack.stop()
        localStream.removeTrack(oldVideoTrack)

        localStream.addTrack(newVideoTrack)

        peers.forEach(peer => {
            errorMessage('changeTracks Нужно сделать DI')
            const sender = peer.connection && peer.connection!.getSenders().find(item => (item.track && item.track.id) === oldVideoTrack.id)
            
            if(sender) {
                sender.replaceTrack(newVideoTrack)
            }
        })
    }
}

export const closeListenSagaKey = (userId: string) => `${appName}/webrtc/UNBIND_LISTEN_TRACK_${userId}`