import React from 'react'

import { iRoomPeer } from '../../ducks/webrtc-room/entity/room-peer-entity'
import { elementToast } from './toast'

import ToastCanJoinRoom from '../../../components/common/toasts/can-join-room'

export default (user: iRoomPeer, knockToken: string) => {
    elementToast(<ToastCanJoinRoom user={user} knockToken={knockToken} />)
}