import { select, call } from "redux-saga/effects"

import { peersSelector, presenterConnnectionSelector } from ".."
import receivedOfferSaga from "./received-offer"

import { iSocketResultWebRtcData } from "../entity/interface"
import { iPeersConnection } from '../entity/peer-connection-entity'
import { infoMessage } from "../../../code/messages"
import { reconnectConnectionRecever } from './reconnect'
import Toasts from "../../../code/alerts/toast"
import createOfferSaga from "./create-offer"

export default function* webRtcSocketEventSaga(data: any) {
    
    const { type, desc, userId, error } = data.payload

    yield Toasts.messageToast(type + '  ' + userId)

    if(error) {
        return yield Toasts.messageToast(error)
    }

    infoMessage('Webrtc', data.payload)

    const findedConnection = yield findConnection(userId)  

    infoMessage('Webrtc create', data.payload)

    switch (type) {

        case 'create_offer':
        
            yield call(createOfferSaga, userId)

            break

        case 'iceCandidate':

            if (findedConnection) {
                yield call(addIceCandidate, findedConnection.connection!, desc)
            }

            break

        case 'answer':
            
            if (findedConnection) {
                yield call(setRemoteDescription, findedConnection.connection!, desc)
            }

            break

        case 'reconnect':
            
            yield call(reconnectConnectionRecever, userId, data.payload.mode)

            break

    }
}

export function* findConnection(userId: string) {

    if(userId === 'presenter') {

        const presenterConnection = yield select(presenterConnnectionSelector)
        return presenterConnection

    } else {

        const peers: iPeersConnection[] = yield select(peersSelector)
        return peers.find(item => item.userId == userId)

    }
}

/*
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

}*/

function setRemoteDescription(connection: RTCPeerConnection, desc: any) {
    return connection.setRemoteDescription(new RTCSessionDescription(desc))
}

function addIceCandidate(connection: RTCPeerConnection, desc: RTCIceCandidate) {
    try {
        connection.addIceCandidate(new RTCIceCandidate(desc))
    } catch(e) { 
        console.error(e)
    }
}