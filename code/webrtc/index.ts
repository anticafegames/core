import { call } from "redux-saga/effects"

import { iSocketResultWebRtcData } from "../../ducks/webrtc/entity/interface"
import { socketEmit } from "../socket/socket-emit"

type WebRtcSocketType = 'offer' | 'iceCandidate' | 'answer' | 'reconnect'

export const getSocketResult = (type: WebRtcSocketType, to: string, desc: any): iSocketResultWebRtcData => ({ type, to, desc })

export const webrtcSocketEmit = function* (data: iSocketResultWebRtcData) { 
    return yield call(socketEmit, 'webrtc', data) 
}