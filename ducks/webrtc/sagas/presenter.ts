import { call, put, select } from 'redux-saga/effects'

import createOffer from './create-offer'
import { getSocketResult } from '../../../code/webrtc'
import { socketEmit } from '../../../code/socket/socket-emit'
import { ROOM_CONNECT_SUCCESS } from '..'
import { withoutWebrtcSelector } from '../../webrtc-room'

export function* startPresenter() {
    yield call(createOffer, 'presenter')
}
