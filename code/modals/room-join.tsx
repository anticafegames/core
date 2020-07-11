import React from 'react'

import { showElement } from '../../ducks/modal'
import { iShortRoom } from '../../ducks/webrtc-rooms/entity/rooms-entity'

import RoomJoinFormPage from '../../components/room-list-page/find-room-block/room-join-form'

export default (room: iShortRoom) => {
    return showElement(close => <RoomJoinFormPage closeModalWindow={close} room={room!} />, { className:  'room-join-modal' })
}