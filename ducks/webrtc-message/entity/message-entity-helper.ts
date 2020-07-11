import { iUser } from '../../authentication/entity/auth-user-entity'
import { iRoomPeer } from '../../webrtc-room/entity/room-peer-entity'
import messageEntity, { iMessage } from './message-entity'
import messageSenderEntity, { iMessageSender } from './message-sender-entity'

export const userToSender = (user: iUser | iRoomPeer) => {

    const sender: iMessageSender = {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        href: user.href,
        profilePhoto: user.profilePhoto
    }

    return sender
}