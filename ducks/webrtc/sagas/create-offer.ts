import { fork, select, call, put, take } from 'redux-saga/effects'

import { serverConfiguration, offerOptions } from '../../../config/webrtc-config'
import listenOnIceCandidate from './onicecandidate'
import { addTrack, listenOnTrack } from './track'
import { listenOnDataChannel, createDataChannel } from './datachannel'

import { getSocketResult, webrtcSocketEmit } from '../../../code/webrtc'
import { todo, errorMessage, infoMessage } from '../../../code/messages'
import { iResult } from '../../../code/common/interfaces'
import { getResult } from '../../../code/common'
import { createConnection } from './peer-connection'
import { reconnectTimer } from './reconnect'

export default function* createOfferSaga (userId: string) {
    
    infoMessage(`createOffer() userId: ${userId}`)

    const connection: RTCPeerConnection = yield call(createConnection, userId)
    
    yield fork(listenOnIceCandidate, connection, userId)
    yield fork(listenOnTrack, connection, userId)
    
    yield call(createDataChannel, connection, userId)
    yield call(addTrack, connection)
    yield fork(reconnectTimer, userId, connection)

    const { error, result: desc } = yield call(createOffer, connection)

    if (!error) {

        yield call(createOffer_success, connection, desc, userId)

    } else {
        errorMessage(error)
    }
}

function* createOffer_success(connection: RTCPeerConnection, desc: any, userId: string) {

    yield call(setLocalDescription, connection, desc)

    const data = getSocketResult('offer', userId, desc)
    yield call(webrtcSocketEmit, data)

    infoMessage(`Создан оффер. userId: ${userId}`)
}

function createOffer(connection: RTCPeerConnection): Promise<iResult<RTCSessionDescriptionInit>> {

    const promise = new Promise<iResult<RTCSessionDescriptionInit>>(async (resolve) => {

        try {
            const desc = await connection.createOffer(offerOptions)
            resolve(getResult('', desc))
        }
        catch {
            resolve(getResult('Не удалось создать оффер'))
        }
    })

    return promise
}

function setLocalDescription(connection: RTCPeerConnection, desc: any) {
    return connection.setLocalDescription(new RTCSessionDescription(desc))
}