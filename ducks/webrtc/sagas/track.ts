import { eventChannel } from "redux-saga"
import { select, put, take, call, fork, race } from "redux-saga/effects"

import { localStreamSelector, CREATE_LOCAL_STREAM_SUCCESS, ADD_TRACK_REQUEST, peersSelector } from ".."

import { todo, infoMessage } from "../../../code/messages"
import { iPeersConnection } from "../entity/peer-connection-entity"
import { appName } from "../../../config/app-config"


export function* listenOnTrack(connection: RTCPeerConnection, userId: string) {

    const channel = yield eventChannel((emit: any) => {
        connection.ontrack = (event: any) => emit(event)
        return () => { connection.ontrack = null }
    })

    yield fork(listen, channel, userId)
}

export function* listen(channel: any, userId: string) {

    while (true) {

        const { channelEvent, channelClose } = yield race({
            channelEvent: take(channel),
            channelClose: take(closeListenSagaKey(userId))
        }) 
        
        if(!channelEvent) {
            infoMessage(`Закрыли канал OnTrack userId: ${userId}`)
            return yield call(channel.close)
        } 

        const event = channelEvent

        yield call(ontrack, event, userId)
    }
}

export function* ontrack(event: any, userId: string) {

    infoMessage(`Добавлен трек userId: ${userId}`)

    const track = event.streams[0] as MediaStream || null

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

    localStream.getTracks().forEach((track: MediaStreamTrack) => connection.addTrack(track, localStream))
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

            const sender = peer.connection && peer.connection!.getSenders().find(item => (item.track && item.track.id) === oldVideoTrack.id)
            
            if(sender) {
                sender.replaceTrack(newVideoTrack)
            }
        })
    }
}

export const closeListenSagaKey = (userId: string) => `${appName}/webrtc/UNBIND_LISTEN_TRACK_${userId}`