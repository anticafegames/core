import { List, Record } from 'immutable'
import RoomPeerEntity from '../../../../ducks/webrtc-room/entity/room-peer-entity'

export interface iGameUser {
    userId: string
    user?: RoomPeerEntity
    itIsMe: boolean
}

const defaultParams: iGameUser = {
    userId: '',
    user: undefined,
    itIsMe: false
}

export default class GameUserEntity extends Record(defaultParams) {

    constructor(params?: iGameUser) {
        params ? super(params) : super()
    }

    get user() {
        return this.get('user') as RoomPeerEntity
    }

    get id() {
        return this.get('userId') as string
    }

    get userId() {
        return this.id
    }
}