import { fork, select, call, put, take } from "redux-saga/effects"

import { getSocketResult, webrtcSocketEmit } from "../../../code/webrtc"
import listenOnIceCandidate from "./onicecandidate"
import { addTrack, listenOnTrack } from "./track"
import { createDataChannel, listenOnDataChannel } from './datachannel'

import { serverConfiguration, answerOptions } from "../../../config/webrtc-config"
import { iResult } from "../../../code/common/interfaces"
import { getResult } from "../../../code/common"
import { infoMessage, errorMessage } from "../../../code/messages"
import { createConnection } from "./peer-connection"
import { reconnectTimer } from "./reconnect"

export default function* receivedOfferSaga (desc: any, userId: string) {

    infoMessage(`receiveOffer() userId: ${userId}`)

    const connection: RTCPeerConnection = yield call(createConnection, userId)

    yield fork(listenOnIceCandidate, connection, userId)
    yield fork(listenOnTrack, connection, userId)
    yield fork(listenOnDataChannel, connection, userId)
    
    yield call(setRemoteDescription, connection, new RTCSessionDescription(desc))
    yield call(addTrack, connection)

    const { error, result } = yield call(createAnswer, connection)

    if (!error) {
        
        yield call(createAnswer_success, connection, result, userId)

    } else {
        errorMessage(error)
    }
  }

  function* createAnswer_success(connection: RTCPeerConnection, desc: any, userId: string) {
    
    infoMessage(`Создан setLocalDescription start. userId: ${userId}`)
    yield call(setLocalDescription, connection, desc)
    infoMessage(`Создан setLocalDescription end. userId: ${userId}`)
    
    const data = getSocketResult('answer', userId, desc)
    yield call(webrtcSocketEmit, data)

    infoMessage(`Создан answer. userId: ${userId}`)
}

function createAnswer(connection: RTCPeerConnection): Promise<iResult<any>> {

    const promise = new Promise<iResult<any>>(async (resolve) => {

        try {
            const desc = await connection.createAnswer()
            resolve(getResult('', desc))
        }
        catch {
            resolve(getResult('Не удалось создать answer'))
        }
    })

    return promise
}

function setLocalDescription(connection: RTCPeerConnection, desc: any) {
    return connection.setLocalDescription(desc)
}

function setRemoteDescription(connection: RTCPeerConnection, desc: any) {
    return connection.setRemoteDescription(new RTCSessionDescription(desc))
}