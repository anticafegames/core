import { call, put } from 'redux-saga/effects'

import createOffer from './create-offer'
import { getSocketResult } from '../../../code/webrtc'
import { socketEmit } from '../../../code/socket/socket-emit'
import { ROOM_CONNECT_SUCCESS } from '..'

export function* startPresenter() {

    console.log('startPresenter')
    yield call(createOffer, 'presenter')
}
