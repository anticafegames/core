import { eventChannel } from "redux-saga"
import { select, put, take, call, fork } from "redux-saga/effects"

import { todo, infoMessage } from "../../../code/messages"
import { getSocketResult, webrtcSocketEmit } from "../../../code/webrtc"
import { addChannelSaga } from "./sagas-request"

export function* listenOnDataChannel(connection: RTCPeerConnection, userId: string) {

    todo('Закрыть канал, когда нашли', 'listenOnIceCandidate')

    const channel = yield eventChannel((emit: any) => {
        connection.ondatachannel = (event: any) => emit(event)
        return () => { connection.ondatachannel = null }
    })

    yield fork(listen, channel, userId)
}

export function* listen(channel: any, userId: string) {

    while (true) {
        const event = yield take(channel)
        yield call(ondatachannel, event, userId)
        yield call(channel.close)
    }
}

export function* ondatachannel({ channel }: RTCDataChannelEvent, userId: string) {

    if (channel) {

        infoMessage(`ondatachannel userId: ${userId}`)
        yield call(addChannelSaga, { payload: { userId, channel } })
    }
}

export function* createDataChannel(connection: RTCPeerConnection, userId: string) {

    infoMessage(`createDataChannel userId: ${userId}`)

    const channel = connection.createDataChannel('messages')
    yield call(addChannelSaga, { payload: { userId, channel } })
}