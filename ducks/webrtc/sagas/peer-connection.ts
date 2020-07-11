import { put, fork, call } from "redux-saga/effects"

import { listenOnTrack, addTrack } from "./track"
import listenOnIceCandidate from "./onicecandidate"
import { ADD_PEER_CONNECTION_REQUEST } from ".."

import { serverConfiguration } from "../../../config/webrtc-config"
import { todo } from "../../../code/messages"

export function* createConnection(userId: string) {
    
    todo('Ревлизовано RTCPeerConnection, нужно сделать второе тоже', 'webrtc/createOffer')

    const connection = new RTCPeerConnection(serverConfiguration)

    yield put({
        type: ADD_PEER_CONNECTION_REQUEST,
        payload: { userId, connection }
    })

    return yield connection
}