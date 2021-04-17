import { select } from 'redux-saga/effects'
import { roomUsersSelector } from '../../../../ducks/webrtc-room'
import { iRoomPeer } from '../../../../ducks/webrtc-room/entity/room-peer-entity'
import Toasts from '../../../../code/alerts/toast'

export function* canStartGame() {

    const users: iRoomPeer[] = yield select(roomUsersSelector)

    if(users.length < 3) {
        Toasts.messageToast('В комнате должно быть более четырех игроков')
        return false
    }

    return true
}