import RoomPeerEntity, { iRoomPeer } from '../../../../ducks/webrtc-room/entity/room-peer-entity'

export type iGameState = 'prepare' | 'game'

export interface iReconnectStateResponce {
    settings: iGameSettings
    teams: iTeamResponce[]
    state: iGameState
}

export interface iGameSettings {

}

export interface iTeamResponce {
    name: string,
    users: iGameUserResponce[]
}

export interface iGameUserResponce {
    userId: string
    vkId: number
    owner: boolean
}
export interface iPack {
    value: string
    text: string
}

export interface iDeleteTeamResponce {
    teamId: string
    toTeam: string
    users: string[]
}

export interface iStartGameRequest {
    settings: iGameSettings
    teams: iTeamRequest[]
}

export interface iTeamRequest {
    name: string,
    users: string[]
}