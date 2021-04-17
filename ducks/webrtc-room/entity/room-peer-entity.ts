import { Record } from "immutable"

export interface iPeerRoomSocketResponse {
    id: string
    vkId: number
}

export interface iRoomPeer {
    id: string
    vkId: number
    first_name: string
    last_name: string
    nickname: string
    href: string
    profilePhoto: string
}

export const defaultParams: iRoomPeer = {
    id: '',
    vkId: -1,
    first_name: '',
    last_name: '',
    nickname: '',
    href: '',
    profilePhoto: '',
}

export default class RoomPeerEntity extends Record(defaultParams) {

    constructor(params?: iRoomPeer) {
        params ? super(params) : super()
    }

    get id () {
        return this.get('id') 
    }

    toobject() {
        return this.toJS() as iRoomPeer
    }
}