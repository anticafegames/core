import { select, call } from "redux-saga/effects"
import { List } from "immutable"

import { iGameUser } from "./game-user-entity"
import RoomPeerEntity, { iRoomPeer, iPeerRoomSocketResponse } from '../../../../ducks/webrtc-room/entity/room-peer-entity'
import { roomUsersSelector } from '../../../../ducks/webrtc-room'
import { iUser, AuthUserEntity } from '../../../../ducks/authentication/entity/auth-user-entity'
import { userSelector } from "../../../../ducks/user"
import { errorMessage } from "../../../../code/messages"
import { iTeamResponce, iGameUserResponce, iReconnectStateResponce, iStartGameRequest } from "./interface"
import VKApi from "../../../../code/api/vk-api/vk-api"
import { iTeam } from "./team-entity"
import { settingsParamsSelector, settingsSelector, teamsSelector } from ".."

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

export function* convertResponceTeams(state: iTeamResponce[]) {

    const allUsers = state.reduce<iGameUserResponce[]>((list, team) => {
        list.push(...team.users)
        return list
    }, [])

    const users: iGameUser[] = yield call(convertResponceGameUser, allUsers)

    const teams = state.map((team) => {

        return {
            ...team,
            users: team.users.map(responceUser => users.find(user => responceUser.userId === user.userId))
        }
    })

    return teams
}

export function* convertReconnectStateResponce(state: iReconnectStateResponce) {

    const teams: iTeam[] = yield call(convertResponceTeams, state.teams)

    return {
        ...state,
        teams
    }
}

export function* settingsToRequest(): any {

    const settings = yield select(settingsParamsSelector)
    const teamEntities = yield select(teamsSelector)
    
    const state: iStartGameRequest = {
        settings,
        teams: teamEntities.map((team: iTeam) => ({
            name: team.name,
            users: team.users.map(user => user!.userId)
        }))
    }

    return state
}
