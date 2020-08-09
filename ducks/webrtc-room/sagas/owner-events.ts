import { select, put, call } from "redux-saga/effects"
import { userIdSelector } from "../../authentication"
import { CHANGE_OWNER_ID_SUCCESS } from ".."
import { socketEmit } from "../../../code/socket/socket-emit"
import RoomPeerEntity from "../entity/room-peer-entity"
import VKApi from "../../../code/api/vk-api/vk-api"

import canJoinRoomToast from '../../../../code/alerts/can-join-room'

export function* changeOwnerIdSaga({ payload }: any) {

    const { ownerId } = payload

    const userId = yield select(userIdSelector)
    const isOwner = userId === ownerId

    yield put({
        type: CHANGE_OWNER_ID_SUCCESS,
        payload: { ownerId, isOwner }
    })
}

export function* changeOwnerEmitSaga({ payload }: any) {
    const { userId } = payload
    yield call(socketEmit, 'room_change_owner', { userId })
}

export function* kickUserSaga({ payload }: any) {
    const { userId } = payload
    yield call(socketEmit, 'room_kick_user', { userId })
}

export function* canJoinRoomSaga({ payload }: any) {

    const { user: userResponce, knockToken } = payload
    const [user]: any[] = yield call(VKApi.loadRoomPeers, [userResponce])

    if(!user) return

    canJoinRoomToast(user, knockToken)
} 

export function* canJoinRoomSuccessSaga({ payload }: any) {
    const { userId, knockToken } = payload
    yield call(socketEmit, 'room_owner_knock_on_room', { userId, knockToken })
}
