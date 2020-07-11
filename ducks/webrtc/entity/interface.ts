import { List } from "immutable"

export interface iSocketResultWebRtcData {
    type: string,
    to?: string,
    desc: any,
    from?: string 
}

export type reconnectMode = 'connecting' | 'stateChange'
