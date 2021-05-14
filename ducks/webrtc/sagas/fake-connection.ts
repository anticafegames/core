import { select, put, all } from 'redux-saga/effects'

import { ADD_PEER_CONNECTION_REQUEST, localStreamSelector } from '..'
import { roomUsersSelector } from '../../webrtc-room'
import { iRoomPeer } from '../../webrtc-room/entity/room-peer-entity'
import { iPeersConnection } from '../entity/peer-connection-entity'

export function* createFakeConnectionSaga (userId: string): any {

    const localStream = yield select(localStreamSelector)

    yield put({
        type: ADD_PEER_CONNECTION_REQUEST,
        payload: { userId, track: localStream }
    })
}

export function* createFakeRoomConnectionsSaga () {

    let roomPeers: iRoomPeer[] = yield select(roomUsersSelector)

    let users = roomPeers.map(peer => createFakeConnectionSaga(peer.id))
    users.push(createFakeConnectionSaga('presenter'))

    yield all(users)
}