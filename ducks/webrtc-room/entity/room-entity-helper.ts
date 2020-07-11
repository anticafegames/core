import { List } from 'immutable'
import { select, call } from 'redux-saga/effects'

import PeerEntity, { iRoomPeer } from './room-peer-entity'
import { roomUsersSelector } from '..'


export const findRoomUsers = function* (filter: (roomPeer: iRoomPeer) => boolean) {
    const users: iRoomPeer[] = yield select(roomUsersSelector) 
    return users.filter(filter)
} 

export const findRoomUserById = function* (id: string) {
    const [peer] = (yield call(findRoomUsers, peer => peer.id === id)) as iRoomPeer[]
    return peer
}