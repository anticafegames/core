import { select } from 'redux-saga/effects'
import { roomUsersSelector } from '../../../../ducks/webrtc-room'
import { iRoomPeer } from '../../../../ducks/webrtc-room/entity/room-peer-entity'
import Toasts from '../../../../code/alerts/toast'

export function* canStartGame() {

    const users: iRoomPeer[] = yield select(roomUsersSelector)

    if(!users.length) {
        Toasts.messageToast('В комнате должно быть более одного игрока')
        return false
    } 

    return true
}