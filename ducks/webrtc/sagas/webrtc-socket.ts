import { select, call } from "redux-saga/effects"

import { peersSelector } from ".."
import receivedOfferSaga from "./received-offer"

import { iSocketResultWebRtcData } from "../entity/interface"
import { iPeersConnection } from '../entity/peer-connection-entity'
import { infoMessage } from "../../../code/messages"
import { reconnectConnectionRecever } from './reconnect'

export default function* webRtcSocketEventSaga({ payload }: any) {

    const { type, desc, from } = payload

    infoMessage('Webrtc', payload)

    const peers: iPeersConnection[] = yield select(peersSelector)
    const findedConnection = peers.find(item => item.userId == from)

    infoMessage('Webrtc create', payload)

    switch (type) {

        case 'offer':

            yield call(receivedOfferSaga, desc, from)

            break

        case 'iceCandidate':

            if (findedConnection) {
                yield call(addIceCandidate, findedConnection.connection!, new RTCIceCandidate(desc))
            }

            break

        case 'answer':
            
            if (findedConnection) {
                yield call(setRemoteDescription, findedConnection.connection!, desc)
            }

            break

        case 'reconnect':

            yield call(reconnectConnectionRecever, from, payload.mode)

            break

    }

}

function setRemoteDescription(connection: RTCPeerConnection, desc: any) {
    return connection.setRemoteDescription(new RTCSessionDescription(desc))
}

function addIceCandidate(connection: RTCPeerConnection, desc: any) {
    return connection.addIceCandidate(new RTCIceCandidate(desc))
}