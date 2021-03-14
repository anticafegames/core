import { Record } from 'immutable'
import { iRegRoomParams } from './room-reg-params-entity'

export interface iDebugRoomParams {
    debugMode: boolean
    withoutWebRTC?: boolean
}

export const defaultParams: iDebugRoomParams = {
    debugMode: false,
    withoutWebRTC: false
}

export default class extends Record(defaultParams) {}
