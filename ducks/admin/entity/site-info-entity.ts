import RoomEntity, { iRoom } from "../../webrtc-room/entity/room-entity"
import { Record, List } from "immutable"
import RoomPeer, { iRoomPeer } from "../../webrtc-room/entity/room-peer-entity"

export interface iSiteInfo {
    rooms: iRoom[] | RoomEntity[] | List<RoomEntity>
    users: iRoomPeer[] | RoomPeer[] | List<RoomPeer>
}

const defaultParams: iSiteInfo = {
    rooms: List([]),
    users: List([])
}

export default class MainEntity extends Record(defaultParams) {

    constructor(params?: iSiteInfo) {

        if (!params) {
            super()

        } else {

            params.users = List(params.users)
            params.rooms = List(params.rooms)

            super(params)
        }
    }
}