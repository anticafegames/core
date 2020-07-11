import RoomEntity, { iRoom } from "./room-entity"
import { Record, List } from "immutable"
import RoomPeer, { iRoomPeer } from "./room-peer-entity"
import { roomStatus } from "./interface"

export interface iMainEntity {
    room?: iRoom | RoomEntity
}

const defaultParams: iMainEntity = {
    room: undefined
}

export default class MainEntity extends Record(defaultParams) {

    constructor(params?: iMainEntity) {
        params ? super(params) : super()
    }

    setRoom(room?: iRoom) {
        return this.set('room', room && new RoomEntity(room)) as this
    }

    addUser(user: iRoomPeer) {
        return this.updateIn(['room', 'users'], list => list.merge(list.push(user))) as this
    }

    deleteUser(userId: string) {
        const users: List<RoomPeer> = this.getUsers() 
        const userIndex = users.findIndex(user => user!.id === userId)
        return this.deleteIn(['room', 'users', userIndex]) as this
    }

    changeOwner(ownerId: string, isOwner: boolean) {
        return this.setIn(['room', 'ownerId'], ownerId).setIn(['room', 'isOwner'], isOwner) as this
    }

    changeRoomStatus(status: roomStatus) {
        return this.setIn(['room', 'status'], status) as this
    }

    getUsers() {
        return this.getIn(['room', 'users']) || List([])
    }
}