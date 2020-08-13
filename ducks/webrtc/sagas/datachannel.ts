import { eventChannel } from "redux-saga"
import { select, put, take, call, fork } from "redux-saga/effects"

import { todo, infoMessage, errorMessage } from "../../../code/messages"
import { getSocketResult, webrtcSocketEmit } from "../../../code/webrtc"
import { addChannelSaga } from "./sagas-request"

export function* listenOnDataChannel(connection: RTCPeerConnection, userId: string) {

    todo('Закрыть канал, когда нашли', 'listenOnIceCandidate')

    const channel = yield eventChannel((emit: any) => {
        errorMessage('На нативе нету ondatachannel')
        /*connection.ondatachannel = (event: any) => emit(event)*/
        return () => { }
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

export function* ondatachannel({ channel }: any, userId: string) {
    errorMessage('На нативе нету ondatachannel')
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