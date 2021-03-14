import { appName } from '../../config/app-config'
import { createSelector } from 'reselect'
import { List } from 'immutable'
import { takeEvery, all } from 'redux-saga/effects'

import { bindSocketEvents } from '../../code/socket/bind-socket-events-helper'
import { iSocketAction } from '../socket/entity/interface'
import { ROOM_JOIN_SOCKET_EVENT, LEAVE_SOCKET_EVENT } from '../webrtc'
import MainEntity, { iMainEntity } from './entity/main-entity'
import { checkReconnectRoom, roomConnectSocketSuccessSaga, leavePeerRoomSocketEventSaga, roomJoinSocketEventSaga, roomConnectSocketRequestSaga, leaveFromRoomSaga, kickFromRoomSaga, knockOnRoomEmitSaga } from './sagas/connect'
import { changeOwnerIdSaga, changeOwnerEmitSaga, kickUserSaga, canJoinRoomSaga, canJoinRoomSuccessSaga } from './sagas/owner-events'
import { iRoom } from './entity/room-entity'
import RoomPeerEntity, { iRoomPeer } from './entity/room-peer-entity'

/*
*   Contstants 
*/

export const moduleName = 'webrtc-room'

const prefix = `${appName}/${moduleName}`

export const ROOM_CONNECT_REQUEST = `${prefix}/ROOM_CONNECT_REQUEST`
export const ROOM_CONNECT_SOCKET_EVENT = `${prefix}/ROOM_CONNECT_SOCKET_EVENT`
export const ROOM_CONNECT_SUCCESS = `${prefix}/ROOM_CONNECT_SUCCESS`

export const ADD_ROOM_PEER = `${prefix}/ADD_ROOM_PEER`
export const LEAVE_ROOM_PEER = `${prefix}/LEAVE_ROOM_PEER`

export const LEAVE_FROM_ROOM_REQUEST = `${prefix}/LEAVE_FROM_ROOM_REQUEST`
export const LEAVE_FROM_ROOM_SUCCESS = `${prefix}/LEAVE_FROM_ROOM_SUCCESS`

export const CHANGE_OWNER_ID_REQUEST = `${prefix}/CHANGE_OWNER_ID_REQUEST`
export const CHANGE_OWNER_ID_SOCKET_EVENT = `${prefix}/CHANGE_OWNER_ID_SOCKET_EVENT`
export const CHANGE_OWNER_ID_SUCCESS = `${prefix}/CHANGE_OWNER_ID_SUCCESS`

export const CHANGE_ROOM_STATUS = `${prefix}/CHANGE_ROOM_STATUS`

export const KICK_FROM_ROOM_REQUEST = `${prefix}/KICK_FROM_ROOM_REQUEST`
export const KICK_FROM_ROOM_SOCKET_EVENT = `${prefix}/KICK_FROM_ROOM_SOCKET_EVENT`

export const KNOCK_ON_ROOM_REQUEST = `${prefix}/KNOCK_ON_ROOM_REQUEST`

export const OWNER_KNOCK_ON_ROOM_SOCKET_EVENT = `${prefix}/OWNER_KNOCK_ON_ROOM_SOCKET_EVENT`
export const OWNER_KNOCK_ON_ROOM_SUCCESS = `${prefix}/OWNER_KNOCK_ON_ROOM_SUCCESS`

export const ROOM_INFO_SOCKET_EVENT = `${prefix}/ROOM_INFO_SOCKET_EVENT`

/*
*   Reducer
*/

export default function reducer(state = new MainEntity(), action: any) {
    const { type, payload } = action

    switch (type) {

        case ROOM_CONNECT_SUCCESS:
            return state
                .setRoom(payload.room)

        case ADD_ROOM_PEER:
            return state
                .addUser(payload.user)

        case CHANGE_OWNER_ID_SUCCESS:
            return state
                .changeOwner(payload.ownerId, payload.isOwner)

        case CHANGE_ROOM_STATUS:
            return state
                .changeRoomStatus(payload.status)

        case LEAVE_ROOM_PEER:
            return state
                .deleteUser(payload.userId)

        case LEAVE_FROM_ROOM_SUCCESS:
            return state
                .setRoom()

        default:
            return state

    }
}

/*
*   Selectors
*/

export const stateSelector = (state: any) => state[moduleName] as iMainEntity
export const roomSelector = createSelector(stateSelector, state => state.room as iRoom)
export const roomUsersSelector = createSelector(roomSelector, room => ((room && (room.users as List<RoomPeerEntity>).toJS()) || []) as iRoomPeer[]) 
export const roomUserEntitiesSelector = createSelector(roomSelector, room => (room && (room.users as List<RoomPeerEntity>)) || [])

export const roomIdSelector = createSelector(roomSelector, state => state && state.id)
export const nameSelector = createSelector(roomSelector, state => state.name)

export const connectedRoomSelector = createSelector(stateSelector, state => !!state.room)
export const IAmOwnerSelector = createSelector(roomSelector, room => room && room.isOwner)

export const debugParamsSeletor = createSelector(roomSelector, state => state && state.debugParams)
export const debugModeSelector = createSelector(debugParamsSeletor, state => state && state.debugMode)
export const withoutWebRTCSelector = createSelector(debugParamsSeletor, state => state && state.debugMode && state.withoutWebRTC)

/*
*   Action Creaters
*/


/*
*   Sagas
*/

export const socketActions: iSocketAction[] = [
    {
        socketKey: 'room_connect',
        sagaKey: ROOM_CONNECT_SOCKET_EVENT
    },
    {
        socketKey: 'room_change_owner',
        sagaKey: CHANGE_OWNER_ID_SOCKET_EVENT
    },
    {
        socketKey: 'room_kick_from_room',
        sagaKey: KICK_FROM_ROOM_SOCKET_EVENT
    },
    {
        socketKey: 'room_owner_knock_on_room',
        sagaKey: OWNER_KNOCK_ON_ROOM_SOCKET_EVENT
    }
]

export function* saga() {
    yield all([
        checkReconnectRoom(),
        bindSocketEvents(socketActions),
        takeEvery(ROOM_CONNECT_SOCKET_EVENT, roomConnectSocketSuccessSaga),
        takeEvery(ROOM_JOIN_SOCKET_EVENT, roomJoinSocketEventSaga),
        takeEvery(LEAVE_SOCKET_EVENT, leavePeerRoomSocketEventSaga),
        takeEvery(CHANGE_OWNER_ID_SOCKET_EVENT, changeOwnerIdSaga),
        takeEvery(KICK_FROM_ROOM_SOCKET_EVENT, kickFromRoomSaga),
        takeEvery(OWNER_KNOCK_ON_ROOM_SOCKET_EVENT, canJoinRoomSaga),

        takeEvery(ROOM_CONNECT_REQUEST, roomConnectSocketRequestSaga),
        takeEvery(LEAVE_FROM_ROOM_REQUEST, leaveFromRoomSaga),
        takeEvery(CHANGE_OWNER_ID_REQUEST, changeOwnerEmitSaga),
        takeEvery(KICK_FROM_ROOM_REQUEST, kickUserSaga),
        takeEvery(KNOCK_ON_ROOM_REQUEST, knockOnRoomEmitSaga),
        takeEvery(OWNER_KNOCK_ON_ROOM_SUCCESS, canJoinRoomSuccessSaga)
    ])
}