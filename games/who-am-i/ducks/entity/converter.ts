import { select, call } from "redux-saga/effects"
import { List } from "immutable"

import { iGameUserResponce, iGameUser } from "./game-user-entity"
import RoomPeerEntity, { iRoomPeer, iPeerRoomSocketResponse } from '../../../../ducks/webrtc-room/entity/room-peer-entity'
import { roomUsersSelector } from '../../../../ducks/webrtc-room'
import { iUser, AuthUserEntity } from '../../../../ducks/authentication/entity/auth-user-entity'
import { userSelector } from "../../../../ducks/user"
import { errorMessage } from "../../../../code/messages"
import { iReconnectStateResponce } from "./interface"
import VKApi from "../../../../code/api/vk-api/vk-api"

export function* convertResponceGameUser(gameUsersResponce: iGameUserResponce[]) {

    const user: AuthUserEntity = yield select(userSelector)
    const roomUsers: List<RoomPeerEntity> = yield select(roomUsersSelector)

    const users = gameUsersResponce.map(responceUser => {

        let userEntity
        let itIsMe = false

        if(responceUser.userId === user.id) {
            userEntity = user.roomPeerEntity
            itIsMe = true
        }

        if(!userEntity) {
            userEntity = roomUsers.find(item => responceUser.userId === item!.id)
        }

        return {
            ...responceUser,
            user: userEntity,
            itIsMe
        }
    })

    const unfoundUsers = users.filter(user => !user.user)
    const unfoundUsersIds = unfoundUsers.map(user => user.userId)

    const unfoundRoomPeers = gameUsersResponce.filter(user => unfoundUsersIds.includes(user.userId)).map(user => <iPeerRoomSocketResponse>({ id: user.userId, vkId: user.vkId }))

    const loadedUsers: RoomPeerEntity[] = yield call(VKApi.loadRoomPeers, unfoundRoomPeers)
    unfoundUsers.forEach(user => user.user = loadedUsers.find(item => item.id === user.userId)!)

    return users
}

export function* convertReconnectStateResponce(state: iReconnectStateResponce) {

    const users: iGameUser[] = yield call(convertResponceGameUser, state.users)

    return {
        ...state,
        users
    }
}

export const sortBuyOrdernum = (a: iGameUser, b: iGameUser) => a > b ? -1 : 1