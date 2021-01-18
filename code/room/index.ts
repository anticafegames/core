import { select } from 'redux-saga/effects'

import { withoutWebrtcSelector } from '../../ducks/webrtc-room'

export const ignoreReconnectLocations = ['debug']
export const ignoreReconnect = (pathname: string) => ignoreReconnectLocations.some(location => pathname.startsWith(location + '/'))

export function* needWebrtcConnection() {

    const debugRoomWithoutWebrtc = yield select(withoutWebrtcSelector)
    return !debugRoomWithoutWebrtc
}