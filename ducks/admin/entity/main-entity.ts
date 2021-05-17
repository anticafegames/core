import { Record, List } from "immutable"
import SiteInfo, { iSiteInfo } from "./site-info-entity"

import RoomEntity, { iRoom } from "../../webrtc-room/entity/room-entity"
import RoomPeerEntity, { iRoomPeer } from "../../webrtc-room/entity/room-peer-entity"
import { iLog } from "./log-entity"

export interface iMainEntity {
    rooms: List<iRoom>
    users: List<iRoomPeer>
    logs: List<iLog>
    loading: boolean
    loaded: boolean
}

const defaultParams: iMainEntity = {
    rooms: List([]),
    users: List([]),
    logs: List([]),
    loading: false,
    loaded: false
}

export default class MainEntity extends Record(defaultParams) {

    constructor(params?: iMainEntity) {
        params ? super(params) : super()
    }

    addLog(log: iLog) {
        return this.update('logs', (logs: List<iLog>) => {

            let newLogs = logs.push(log)

            if(newLogs.size > 100) {
                newLogs = newLogs.splice(0, newLogs.size - 100).toList()
            }

            return newLogs

        }) as this
    }

    setSiteInfo(siteInfo: iSiteInfo) {
        return this.set('siteInfo', new SiteInfo(siteInfo))
            .set('loading', false) as this
    }

    clearSiteInfo() {
        return this.set('siteInfo', undefined)
            .set('loading', false) as this
    }

    changeLoading(loading: boolean) {
        return this.set('loading', loading) as this
    }
}