import { List, Record } from "immutable"
import ShortRoomEntity, { iShortRoom } from "./rooms-entity"

export interface iMainEntity {
    rooms?: List<ShortRoomEntity> | ShortRoomEntity[] | iShortRoom[]
    roomsLoading: boolean,
    roomsLoaded: boolean
}

export const defaultParams: iMainEntity = {
    rooms: List([]),
    roomsLoading: false,
    roomsLoaded: false
}

export default class MainEntity extends Record(defaultParams) {
    
    constructor(params?: iMainEntity) {
        params ? super(params) : super()
    }

    setRooms(rooms: iShortRoom[] = []) {
        return this.set('rooms', List(rooms.map(room => new ShortRoomEntity(room)))) as this
    }

    addRooms(rooms: iShortRoom[] = []) {
        return this.updateIn(['rooms'], list => list.merge(list.push(...this.roomsEntityList(rooms)))) as this
    }

    deleteRooms(ids: string[]) {

        let rooms = this.getRooms()

        while(ids.length) {

            const roomId = ids.pop()
            const index = rooms.findIndex(item => item! && item!.id === roomId)

            if(index !== -1) {
                rooms = rooms.deleteIn([index])
            }
        }

        return this.set('rooms', rooms) as this
    }

    changeRooms(rooms: iShortRoom[]) {
        return this.deleteRooms(rooms.map(room => room.id)).addRooms(rooms) as this
    }

    setLoading(loading: boolean = false, loaded: boolean = true) {
        return this.set('roomsLoading', loading).set('roomsLoaded', loaded) as this
    }

    getRooms() {
        return this.get('rooms') as List<ShortRoomEntity>
    }

    roomsEntityList(rooms: iShortRoom[]) {
        return rooms.map(room => new ShortRoomEntity(room))
    }
}