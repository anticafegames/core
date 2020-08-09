import { iRoomPeer } from '../../ducks/webrtc-room/entity/room-peer-entity'

//DI
class CustomDialogs {
    static showCanJoidRoomDialog: (user: iRoomPeer, knockToken: string) => void
}

export default CustomDialogs