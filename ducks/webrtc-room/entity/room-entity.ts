import { Record, List } from 'immutable'
import PeerEntity, { iRoomPeer } from './room-peer-entity'
import { roomStatus } from './interface'
import DebugParamsEntity, { iDebugRoomParams, defaultParams as defaultDebugRoomsParams } from './debug-room-params-entity'

export interface iRoomSocketResponse {
    name: string
    id: string
    openRoom: boolean
    users: iRoomPeer[]
    ownerId: string
    status: roomStatus
    maxUsers: number
}

export interface iRoom {
    name: string
    id: string
    openRoom: boolean
    users: List<PeerEntity> | PeerEntity[] | iRoomPeer[]
    ownerId: string
    isOwner: boolean
    status: roomStatus
    maxUsers: number
    debugParams: iDebugRoomParams
}

export const defaultParams: iRoom = {
    id: '',
    name: '',
    users: List([]),
    ownerId: '',
    isOwner: false,
    openRoom: false,
    status: 'wait',
    maxUsers: 6,
    debugParams: defaultDebugRoomsParams
}

export default class RoomEntity extends Record(defaultParams) {

    constructor(params?: iRoom) {
        
        if(!params) { 
            super()
            return
        }

        if((params.users as List<PeerEntity>).getIn === undefined) {
            params.users = List(params.users)
        }
                
       super(params)
    }

    get roomId() {
        return this.get('id')
    }
}