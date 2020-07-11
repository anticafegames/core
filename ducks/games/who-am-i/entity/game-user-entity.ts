import { List, Record } from "immutable"
import RoomPeerEntity, { iRoomPeer } from '../../../webrtc-room/entity/room-peer-entity'

export interface iGameUser {
    userId: string
    user?: RoomPeerEntity
    name: string
    nameFilled: boolean
    userSeesName: boolean
    ordernum: number
    whoMakesUp: string
    itIsMe: boolean
}

export interface iGameUserResponce {
    userId: string
    vkId: number
    name: string
    nameFilled: boolean
    userSeesName: boolean
    ordernum: number
    whoMakesUp: string
}

const defaultParams: iGameUser = {
    userId: '',
    user: undefined,
    name: '',
    nameFilled: false,
    userSeesName: false,
    ordernum: 0,
    whoMakesUp: '',
    itIsMe: false
}

export default class GameUserEntity extends Record(defaultParams) {

    constructor(params?: iGameUser) {
        params ? super(params) : super()
    }

    get id() {
        return this.roomPeerEntity.id
    }

    get itIsMe() {
        return this.get('itIsMe') as boolean
    }

    get roomPeerEntity() {
        return this.get('user') as RoomPeerEntity
    }
}