import { select } from "redux-saga/effects"
import { roomUsersSelector } from "../../../webrtc-room"
import { iRoomPeer } from "../../../webrtc-room/entity/room-peer-entity"
import { messageToast } from "../../../../code/alerts/toast"

export function* canStartGame() {

    const users: iRoomPeer[] = yield select(roomUsersSelector)

    if(!users.length) {
        messageToast('В комнате должно быть более одного игрока')
        return false
    } 

    return true
}