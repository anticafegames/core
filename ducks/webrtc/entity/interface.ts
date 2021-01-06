import { List } from "immutable"

export interface iSocketResultWebRtcData {
    type: string,
    peerId?: string,
    desc: any,
    userId?: string 
}

export type reconnectMode = 'connecting' | 'stateChange'
