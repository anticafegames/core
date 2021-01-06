import { call } from "redux-saga/effects"

import { iSocketResultWebRtcData } from "../../ducks/webrtc/entity/interface"
import { socketEmit } from "../socket/socket-emit"

type WebRtcSocketType = 'presenter' | 'viewer' | 'stop' | 'iceCandidate' | 'reconnect'

export const getSocketResult = (type: WebRtcSocketType, userId: string, desc: any): iSocketResultWebRtcData => ({ type, userId, desc })

export const webrtcSocketEmit = function* (data: iSocketResultWebRtcData) { 
    return yield call(socketEmit, 'webrtc', data) 
}