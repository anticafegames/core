import { delay } from 'redux-saga'
import { call, put } from 'redux-saga/effects'

import createOffer from './create-offer'
import { getSocketResult } from '../../../code/webrtc'
import { socketEmit } from '../../../code/socket/socket-emit'
import { ROOM_CONNECT_SUCCESS } from '..'

export function* roomJoinSocketSaga({ payload }: any) {

    console.log('roomJoinSaga')

    const { userId } = payload
    yield call(createOffer, userId)
}
