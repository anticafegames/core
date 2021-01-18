import { iDebugRoomParams } from './debug-room-params-entity'
import { iRegRoomParams } from './room-reg-params-entity'

export type iRoomJoinMode = 'create' | 'join'
export type roomStatus = 'wait' | 'check-ready' | 'game'

export interface iJoinRoomParams {
    roomId: string
    password?: string
}

