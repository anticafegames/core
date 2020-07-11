import { Record } from 'immutable'

export interface iPeersConnection {
    userId: string,
    connection?: RTCPeerConnection,
    track?: MediaStream
    channel?: RTCDataChannel 
}

const defaultParams: iPeersConnection = {
    userId: '',
    connection: undefined,
    track: undefined,
    channel: undefined
}

export default class PeersConnectionEntity extends Record(defaultParams) {

    constructor(params?: iPeersConnection) {
        params ? super(params) : super()
    } 

    get userId() {
        return this.get('userId') as string
    }
}