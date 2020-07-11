import { Record, List } from "immutable"
import SiteInfo, { iSiteInfo } from "./site-info-entity"
import { isString } from "util"
import RoomEntity, { iRoom } from "../../webrtc-room/entity/room-entity"
import RoomPeerEntity from "../../webrtc-room/entity/room-peer-entity"

export interface iMainEntity {
    siteInfo?: SiteInfo | iSiteInfo
    loading: boolean
}

const defaultParams: iMainEntity = {
    siteInfo: undefined,
    loading: false
}

export default class MainEntity extends Record(defaultParams) {

    constructor(params?: iMainEntity) {
        params ? super(params) : super()
    }

    setSiteInfo(siteInfo: iSiteInfo) {
        this.set('siteInfo', new SiteInfo(siteInfo))
            .set('loading', false) as this
    }

    clearSiteInfo() {
        this.set('siteInfo', undefined)
            .set('loading', false) as this
    }

    changeLoading(loading: boolean) {
        this.set('loading', loading) as this
    }
}