import { appName } from '../../config/app-config'
import { createSelector } from 'reselect'
import { Record, OrderedMap, List } from 'immutable'
import { call, put, takeEvery, all, select, take } from 'redux-saga/effects'

import MainEntity, { iMainEntity } from './entity/main-entity'
import { bindSocketEvents } from '../../code/socket/bind-socket-events-helper'
import { iSocketResult, iSocketAction } from '../socket/entity/interface'
import createLocalStreamSaga, { closeLocalStream } from './sagas/local-stream'
import { todo } from '../../code/messages'

import { roomJoinSocketSaga } from './sagas/rooms'
import receivedOfferSaga from './sagas/received-offer'
import webRtcSocketEventSaga from './sagas/webrtc-socket'
import { addConnectionSaga, addTrackSaga, leavePeerSaga, deleteAllPeersSaga } from './sagas/sagas-request'
import { ROOM_CONNECT_REQUEST } from '../webrtc-room'
import { iPeersConnection } from './entity/peer-connection-entity'
import { startPresenter } from './sagas/presenter'
import { createFakeRoomConnectionsSaga, createFakeConnectionSaga } from './sagas/fake-connection'

/*
*   Contstants 
*/

export const moduleName = 'webrtc'

const prefix = `${appName}/${moduleName}`

export const CREATE_LOCAL_STREAM_REQUEST = `${prefix}/CREATE_LOCAL_STREAM_REQUEST`
export const CREATE_LOCAL_STREAM_SUCCESS = `${prefix}/CREATE_LOCAL_STREAM_SUCCESS`

export const CLOSE_LOCAL_STREAM_REQUEST = `${prefix}/CLOSE_LOCAL_STREAM_REQUEST`
export const CLOSE_LOCAL_STREAM_SUCCESS = `${prefix}/CLOSE_LOCAL_STREAM_SUCCESS`

export const ROOM_CONNECT_SOCKET_EVENT_REQUEST = `${prefix}/ROOM_CONNECT_SOCKET_EVENT_REQUEST`
export const ROOM_CONNECT_SOCKET_EVENT_SUCCESS = `${prefix}/ROOM_CONNECT_SOCKET_EVENT_SUCCESS`
export const ROOM_CONNECT_SUCCESS = `${prefix}/ROOM_CONNECT_SUCCESS`

export const LOAD_ROOMS_REQUEST = `${prefix}/LOAD_ROOMS_REQUEST`

export const ROOM_JOIN_SOCKET_EVENT = `${prefix}/ROOM_JOIN_SOCKET_EVENT`
export const WEBRTC_SOCKET_EVENT = `${prefix}/WEBRTC_SOCKET_EVENT`
export const LEAVE_SOCKET_EVENT = `${prefix}/LEAVE_SOCKET_EVENT`
export const RECEIVED_OFFER = `${prefix}/RECEIVED_OFFER`

export const ADD_PEER_CONNECTION_REQUEST = `${prefix}/ADD_PEER_CONNECTION_REQUEST`
export const ADD_TRACK_REQUEST = `${prefix}/ADD_TRACK_REQUEST`
export const ADD_CHANNEL_REQUEST = `${prefix}/ADD_CHANNEL_REQUEST`

export const ADD_PEERS_SUCCESS = `${prefix}/ADD_PEERS_SUCCESS`
export const ADD_TRACK_SUCCESS = `${prefix}/ADD_TRACK_SUCCESS`
export const ADD_CHANNEL_SUCCESS = `${prefix}/ADD_CHANNEL_SUCCESS`

export const DELETE_PEERS_SUCCEESS = `${prefix}/DELETE_PEERS_SUCCEESS`
export const DELETE_ALL_PEERS_REQUEST = `${prefix}/DELETE_ALL_PEERS_REQUEST`
export const DELETE_ALL_PEERS_SUCCEESS = `${prefix}/DELETE_ALL_PEERS_SUCCEESS`

export const START_PRESENTER = `${prefix}/START_PRESENTER`

export const UPDATE_PROPS = `${prefix}/UPDATE_PROPS`

/*
*   Reducer
*/


export default function reducer(state = new MainEntity(), action: any) {
    const { type, payload } = action

    switch (type) {

        case CREATE_LOCAL_STREAM_SUCCESS:
            return state.addLocalStream(payload.stream)

        case ROOM_CONNECT_SUCCESS:
            return state.addRoomId(payload.roomId)

        case ADD_PEERS_SUCCESS: 
            return state
                .addPeersConnection(payload.peerConnection)
                .updateProps()

        case ADD_TRACK_SUCCESS:
            return state
                .addTrack(payload.userId, payload.track)
                .updateProps()

        case ADD_CHANNEL_SUCCESS:
            return state
                .addChannel(payload.userId, payload.channel)
                .updateProps()

        case DELETE_PEERS_SUCCEESS:
            return state
                .deletePeersConnection(payload.userId)
                .updateProps()
        case DELETE_ALL_PEERS_SUCCEESS:
            return state
                .deleteAllPeers()
                .updateProps()

        case CLOSE_LOCAL_STREAM_SUCCESS: 
            return state.addLocalStream()

        case UPDATE_PROPS:
            return state.updateProps()

        default:
            return state

    }
}

/*
*   Selectors
*/

export const stateSelector = (state: any) => state[moduleName] as iMainEntity

export const presenterConnnectionSelector = createSelector(stateSelector, state => state.presenter)
export const localStreamSelector = createSelector(stateSelector, state => state.localStream)
export const peersSelector = createSelector(stateSelector, state => (state.peers as List<iPeersConnection>).toJS())

export const updatePropsSelector = createSelector(stateSelector, state => state.update)

export const peerSelector = (userId: string) => createSelector(stateSelector, state => {

    if(userId === 'presenter') {
        return state.presenter
    } else {
        return (state.peers as List<iPeersConnection>).find(peer => peer!.userId === userId)
    }
})

/*
*   Action Creaters
*/

/*
*   Sagas
*/

export const socketActions: iSocketAction[] = [
    {
        socketKey: 'room_join',
        sagaKey: ROOM_JOIN_SOCKET_EVENT
    },
    {
        socketKey: 'room_connect',
        sagaKey: ROOM_CONNECT_SOCKET_EVENT_SUCCESS
    },
    {
        socketKey: 'webrtc',
        sagaKey: WEBRTC_SOCKET_EVENT
    },
    {
        socketKey: 'leave',
        sagaKey: LEAVE_SOCKET_EVENT
    }
]

export function* saga() {
    yield all([
        bindSocketEvents(socketActions),
        //takeEvery(ROOM_JOIN_SOCKET_EVENT, roomJoinSocketSaga),
        takeEvery(WEBRTC_SOCKET_EVENT, webRtcSocketEventSaga),
        takeEvery(LEAVE_SOCKET_EVENT, leavePeerSaga),
        takeEvery(ADD_PEER_CONNECTION_REQUEST, addConnectionSaga),
        takeEvery(ADD_TRACK_REQUEST, addTrackSaga),
        takeEvery(CLOSE_LOCAL_STREAM_REQUEST, closeLocalStream),
        takeEvery(DELETE_ALL_PEERS_REQUEST, deleteAllPeersSaga),

        takeEvery(START_PRESENTER, startPresenter)
    ])
}