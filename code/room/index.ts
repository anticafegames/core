import { select } from 'redux-saga/effects'

import { withoutWebRTCSelector } from '../../ducks/webrtc-room'

export const ignoreReconnectLocations = ['debug']
export const ignoreReconnect = (pathname: string) => ignoreReconnectLocations.some(location => pathname.startsWith(location + '/'))

export function* needWebrtcConnection(): any{

    const debugRoomWithoutWebrtc = yield select(withoutWebRTCSelector)
    return !debugRoomWithoutWebrtc
}