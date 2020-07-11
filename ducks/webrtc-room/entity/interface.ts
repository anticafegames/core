
export type iRoomJoinMode = 'create' | 'join'
export type roomStatus = 'wait' | 'check-ready' | 'game'

export interface iRegRoomParams {
    password?: string
    openRoom?: boolean
    isDebug: boolean
    hideRoomInSearch: boolean
}

export interface iJoinRoomParams {
    roomId: string
    password?: string
}
