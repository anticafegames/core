import { Record } from "immutable"
import RoomPeerEntity from '../../webrtc-room/entity/room-peer-entity'

export interface iUser {
    id: string
    vkId: number
    first_name: string
    last_name: string
    href: string
    nickname: string
    profilePhoto: string
}

export const defaultParams: iUser = {
    id: '',
    vkId: -1,
    href: '',
    first_name: '',
    last_name: '',
    nickname: '',
    profilePhoto: ''
}

export class AuthUserEntity extends Record(defaultParams) {

    constructor(params?: iUser) {
        params ? super(params) : super()
    }

    get id() {
        return this.get('id') as string
    }

    get roomPeerEntity() {
        return new RoomPeerEntity(this.toJS())
    }
}
