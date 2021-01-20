import { Record } from 'immutable'
import { iRegRoomParams } from './room-reg-params-entity'

export interface iDebugRoomParams {
    isDebug: boolean
    withoutWebrtc?: boolean
}

export const defaultParams: iDebugRoomParams = {
    isDebug: false,
    withoutWebrtc: false
}

export default class extends Record(defaultParams) {}
