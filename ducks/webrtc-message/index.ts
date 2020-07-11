import { appName } from '../../config/app-config'
import { createSelector } from 'reselect'
import { Record, OrderedMap, List } from 'immutable'
import { delay, eventChannel } from 'redux-saga'
import { call, put, takeEvery, all, select, take, fork } from 'redux-saga/effects'
import { replace } from 'connected-react-router'

import { bindSocketEvents, getSagaKeyUnbindSocket } from '../../code/socket/bind-socket-events-helper'
import { socketEmit } from '../../code/socket/socket-emit'
import { iSocketResult, iSocketAction } from '../socket/entity/interface'
import { todo, infoMessage, errorMessage } from '../../code/messages'
import { iPeersConnection } from '../webrtc/entity/peer-connection-entity'
import { waitBindSocket } from '../../code/socket/bind-socket-events-helper'
import { logInSaga } from '../authentication'
import VKApi from '../../code/api/vk-api/vk-api'
import LocalStorage from '../../code/local-storage'
import { LOAD_USER_SUCCESS, userSelector } from '../user'
import { SOCKET_CONNECT_SUCCESS } from '../socket'
import { waitAuthentication } from '../../code/api/vk-api/vk-api-helper'
import { ADD_TRACK_SUCCESS, ADD_PEERS_SUCCESS, peersSelector, ADD_CHANNEL_SUCCESS } from '../webrtc'
import { listenEvent } from '../../code/ducks/saga-helper'
import { iRoomPeer } from '../webrtc-room/entity/room-peer-entity'
import messageListenerEntity, { iMessageListener } from './entity/message-listener-entity'
import { userToSender } from './entity/message-entity-helper'
import { iUser } from '../authentication/entity/auth-user-entity'
import { findRoomUserById } from '../webrtc-room/entity/room-entity-helper'
import MainEntity from './entity/main-entity'
import { iMessageSender } from './entity/message-sender-entity'
import { iMessage } from './entity/message-entity'

/*
*   Contstants 
*/

export const moduleName = 'webrtc-message'

const prefix = `${appName}/${moduleName}`

export const SEND_MESSAGE_REQUEST = `${prefix}/SEND_MESSAGE_REQUEST`
export const NEW_MESSAGE_REQUEST = `${prefix}/NEW_MESSAGE_REQUEST`

export const ADD_MESSAGE_SUCCESS = `${prefix}/ADD_MESSAGE_SUCCESS`

export const ADD_LISTENER = `${prefix}/ADD_LISTENER`
export const REMOVE_LISTENER = `${prefix}/REMOVE_LISTENER`

export const CLOSE_EVENT_LISTENER = (userId: string) => `${prefix}/CLOSE_EVENT_LISTENER/${userId}`

/*
*   Reducer
*/


export default function reducer(state = new MainEntity(), action: any) {
    const { type, payload } = action

    switch (type) {

        case ADD_MESSAGE_SUCCESS:
            return state
                .addMessage(payload.message)

        case ADD_LISTENER:
            return state
                .addListener(payload.listener)

        default:
            return state

    }
}

/*
*   Selectors
*/

export const stateSelector = (state: any) => state[moduleName]

export const messagesSelector = createSelector(stateSelector, (state: MainEntity) => state.get('messages').toJS())

/*
*   Action Creaters
*/

export function sendMessage(message: string) {
    return {
        type: SEND_MESSAGE_REQUEST,
        payload: { message }
    }
}

/*
*   Sagas
*/

export function* listenMessageSaga({ payload }: any) {

    const channel: RTCDataChannel = payload.channel
    const userId = payload.userId

    infoMessage(`start listen message ${userId}`)

    const unbindSagaKey = CLOSE_EVENT_LISTENER(userId)
    yield fork(listenEvent, (emit: any) => {

        const id = userId
        infoMessage(`start listen message222 ${id}`)
        channel.onmessage = (event: MessageEvent) => { infoMessage(`emit listen message ${id}`); emit({ message: event.data, userId: id }) }
        return () => { channel!.onmessage = null }

    }, NEW_MESSAGE_REQUEST, unbindSagaKey)

    const listener: iMessageListener = { userId, unbindSagaKey }

    yield put({
        type: ADD_LISTENER,
        payload: { listener }
    })
}

export function* newMessageSaga({ payload }: any) {
    infoMessage(`start  saga`, payload)

    const { error, result } = payload
    if(error) return errorMessage('new message', error)

    const { message, userId } = result

    infoMessage(`start lssaga `, userId)
    const peer: iRoomPeer = yield call(findRoomUserById, userId)

    if (!peer) {
        return errorMessage(`newMessageSaga не смогли найти пира id=${userId}`)
    }

    const sender = userToSender(peer)
    yield call(addMessage, message, sender)
}

export function* sendMessageSaga({ payload }: any) {

    const { message } = payload

    if (!message) return

    const peers: iPeersConnection[] = yield select(peersSelector)
    peers.forEach(peer => peer.channel!.send(message));

    const user: iUser = yield select(userSelector)
    const sender = userToSender(user)

    yield call(addMessage, message, sender)
}

export function* addMessage(text: string, sender: iMessageSender) {

    const message: iMessage = { text, sender }

    yield put({
        type: ADD_MESSAGE_SUCCESS,
        payload: { message }
    })
}

export function* saga() {
    yield all([
        takeEvery(ADD_CHANNEL_SUCCESS, listenMessageSaga),
        takeEvery(NEW_MESSAGE_REQUEST, newMessageSaga),
        takeEvery(SEND_MESSAGE_REQUEST, sendMessageSaga)
    ])
}