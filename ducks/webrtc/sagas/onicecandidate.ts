import { eventChannel } from "redux-saga"
import { select, put, take, call, fork, race } from "redux-saga/effects"

import { todo, infoMessage, errorMessage } from "../../../code/messages"
import { getSocketResult, webrtcSocketEmit } from "../../../code/webrtc"
import { appName } from "../../../config/app-config"

export default function* listenOnIceCandidate(connection: RTCPeerConnection, userId: string): any {

    const channel = yield eventChannel((emit: any) => {
        connection.onicecandidate = (event: RTCPeerConnectionIceEvent) => emit(event)
        connection.onicecandidateerror = (event: RTCPeerConnectionIceErrorEvent) => emit({ error: event })
        return () => { connection.onicecandidate = null }
    })

    infoMessage(`Открыыли канал OnIceCandidate userId: ${userId}`)
    yield fork(listen, channel, userId)
}

export function* listen(channel: any, userId: string): any {

    while (true) {

        const { channelEvent, closeChannel } = yield race({
            channelEvent: take(channel),
            closeChannel: take(closeListenSagaKey(userId))
        })

        if(!channelEvent) {
            infoMessage(`Закрыли канал OnIceCandidate userId: ${userId}`)
            return yield call(channel.close)
        } 

        const event = channelEvent

        if(!event.error) {
            yield call(onicecandidate, event, userId)
        }  else {
            errorMessage(event.error)
        }
    }
}

export function* onicecandidate(event: any, userId: string) {

    if (event.candidate) {

        infoMessage(`onicecandidate userId: ${userId}`)

        const data = getSocketResult('iceCandidate', userId, event.candidate)
        yield call(webrtcSocketEmit, data)
    }
}

export const closeListenSagaKey = (userId: string) => `${appName}/webrtc/UNBIND_LISTEN_ON_ICE_CANDIDATE_${userId}`