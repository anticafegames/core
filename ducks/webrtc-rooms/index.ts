import { appName } from '../../config/app-config'
import { createSelector } from 'reselect'
import { Record, OrderedMap, List } from 'immutable'
import { call, put, takeEvery, all, select, take, fork } from 'redux-saga/effects'

import { bindSocketEvents, getSagaKeyUnbindSocket } from '../../code/socket/bind-socket-events-helper'
import { socketEmit } from '../../code/socket/socket-emit'
import { iSocketResult, iSocketAction } from '../socket/entity/interface'
import { todo, infoMessage } from '../../code/messages'
import { iPeersConnection } from '../webrtc/entity/peer-connection-entity'
import { waitBindSocket } from '../../code/socket/bind-socket-events-helper'
import { logInSaga } from '../authentication'
import { arrayToList } from '../../code/ducks/ducks-helper'
import RoomEntity, { iShortRoom, iShortRoomResponse } from './entity/rooms-entity'
import MainEntity from './entity/main-entity'
import { iRoom } from '../webrtc-room/entity/room-entity'
import VKApi from '../../code/api/vk-api/vk-api'
import RoomPeerEntity from '../webrtc-room/entity/room-peer-entity'
import { isEqualRoom } from './entity/helper'

/*
*   Contstants 
*/

export const moduleName = 'webrtc-rooms'

const prefix = `${appName}/${moduleName}`

export const LOAD_ROOMS_REQUEST = `${prefix}/LOAD_ROOMS_REQUEST`
export const LOAD_ROOMS_SOCKET_EVENT = `${prefix}/LOAD_ROOMS_SOCKET_EVENT`
export const LOAD_ROOMS_SUCCESS = `${prefix}/LOAD_ROOMS_SUCCESS`

export const ADD_ROOMS = `${prefix}/ADD_ROOMS`
export const CHANGE_ROOM = `${prefix}/CHANGE_ROOMS`
export const DELETE_ROOMS = `${prefix}/DELETE_ROOMS`
export const LOADED = `${prefix}/LOADED`

export const LEAVE_FROM_ROOM_REQUEST = `${prefix}/LEAVE_FROM_ROOM_REQUEST`
export const LEAVE_FROM_ROOM_SUCCESS = `${prefix}/LEAVE_FROM_ROOM_SUCCESS`

/*
*   Reducer
*/

export default function reducer(state = new MainEntity(), action: any) {
    const { type, payload } = action

    switch (type) {

        case LOAD_ROOMS_REQUEST:
            return state
                .setLoading()

        case ADD_ROOMS:
            return state
                .addRooms(payload.rooms)
        
        case CHANGE_ROOM:
            return state
                .changeRooms(payload.rooms)

        case DELETE_ROOMS:
            return state
                .deleteRooms(payload.ids)

        case LOADED:
            return state
                .setLoading(false, true)

        default:
            return state

    }
}

/*
*   Selectors
*/

export const stateSelector = (state: any) => state[moduleName]

export const roomsSelector = createSelector(stateSelector, state => state.rooms.toJS() as iShortRoom[])
export const roomsLoadingSelector = createSelector(stateSelector, state => state.roomsLoading)
export const roomsLoadedSelector = createSelector(stateSelector, state => state.roomsLoaded)

/*
*   Action Creaters
*/

export function loadRooms() {
    return {
        type: LOAD_ROOMS_REQUEST,
    }
}

export function unbindListenRooms() {
    return {
        type: getSagaKeyUnbindSocket(LOAD_ROOMS_SOCKET_EVENT)
    }
}

/*
*   Sagas
*/

export function* loadRoomsSaga() {

    const socketAction: iSocketAction = {
        socketKey: 'rooms',
        sagaKey: LOAD_ROOMS_SOCKET_EVENT
    }

    yield fork(bindSocketEvents, [socketAction])
    yield call(waitBindSocket, LOAD_ROOMS_SOCKET_EVENT)

    const data = {}
    yield call(socketEmit, 'rooms', data)
}

export function* loadRoomsSocketSaga({ payload }: any): any {

    const { rooms } = payload
    const oldRooms = yield select(roomsSelector)
    
    yield deleteRooms(rooms, oldRooms)
    yield addRooms(rooms, oldRooms)
    yield changeRooms(rooms, oldRooms)

    yield put({type: LOADED})
}

export function* deleteRooms(newRooms: iShortRoomResponse[], oldRooms: iShortRoom[]) {

    const deletedRooms = oldRooms.filter(room => !newRooms.some(item => item.id === room.id))

    if(!deletedRooms.length) return

    yield put({
        type: DELETE_ROOMS,
        payload: { ids: deletedRooms.map(room => room.id) }
    })
}

export function* addRooms(newRooms: iShortRoomResponse[], oldRooms: iShortRoom[]) {

    const roomsResponse = newRooms.filter(room => !oldRooms.some(item => item.id === room.id))

    if(!roomsResponse.length) return
    
    const owners: RoomPeerEntity[] = yield call(VKApi.loadRoomPeers, roomsResponse.filter(room => room.owner).map(room => room.owner!))
    
    const rooms = roomsResponse.map(room => ({
        ...room, owner: owners.find(owner => room.owner && (owner.id === room.owner!.id))!
    }))

    yield put({
        type: ADD_ROOMS,
        payload: { rooms }
    })
}

export function* changeRooms(newRooms: iShortRoomResponse[], oldRooms: iShortRoom[]) {

    const candidateChangedRooms = newRooms.filter(room => oldRooms.some(item => item.id === room.id))
    let changes: any[] = []
    let newOwners: any[] = []

    candidateChangedRooms.forEach(candidate => {

        const oldRoom = oldRooms.find(room => room.id === candidate.id)!

        if(isEqualRoom(oldRoom, candidate)) return

        const change: any = candidate

        if(oldRoom.owner && candidate.owner && oldRoom.owner.id !== candidate.owner.id) {
            newOwners.push({
                room: candidate,
                owner: candidate.owner
            })
        } else {
            change.owner = oldRoom.owner
        }

        changes.push(change)
    })

    if(!changes.length) return

    if(newOwners.length) {

        const owners: RoomPeerEntity[] = yield call(VKApi.loadRoomPeers, newOwners.map(item => item.owner))

        newOwners.forEach(item => {
            const owner = owners.find(ow => ow.id === item.owner.id)
            item.room.owner = owner!
        })
    }

    yield put({
        type: CHANGE_ROOM,
        payload: { rooms: changes }
    })
}

export const socketActions: iSocketAction[] = []

export function* saga() {
    yield all([
        bindSocketEvents(socketActions),
        takeEvery(LOAD_ROOMS_SOCKET_EVENT, loadRoomsSocketSaga),

        takeEvery(LOAD_ROOMS_REQUEST, loadRoomsSaga)
    ])
}