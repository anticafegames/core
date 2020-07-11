import { Record, List } from 'immutable'
import { iPeerRoomSocketResponse, iRoomPeer } from '../../webrtc-room/entity/room-peer-entity'
import PeerEntity from '../../webrtc-room/entity/room-peer-entity'

export interface iShortRoomResponse {
    id: string,
    name: string,
    openRoom: boolean,
    usersLength: number,
    owner?: iPeerRoomSocketResponse
    maxUsers: number
}

export interface iShortRoom {
    id: string,
    name: string,
    openRoom: boolean,
    usersLength: number,
    owner?: PeerEntity | iRoomPeer
    maxUsers: number
}

export const defaultParamsShortRoom: iShortRoom = {
    id: '',
    name: '',
    openRoom: false,
    usersLength: 0,
    owner: undefined,
    maxUsers: 6
}

export default class ShortRoomEntity extends Record(defaultParamsShortRoom) {

    constructor(params?: iShortRoom) {
        params ? super(params) : super()
    }

    get id() {
        return this.get('id') as string
    }

    get owner() {
        return this.get('owner') as PeerEntity
    }
}