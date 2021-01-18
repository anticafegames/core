import { iSession } from "./auth-session-entity"
import { Record } from "immutable"
import { iAnticafeAuthResponse } from "../../../code/api/vk-api/interface"
import { iAppKey } from "./interface"
import { number } from "prop-types"

export interface iAuthentication {
    appKey: iAppKey
    waitAuthentication: boolean
    accessToken?: string
    anticafeToken?: string
    userId?: string,
    vkUserId?: number
    isAdmin?: boolean
    isDeveloper?: boolean
}

export const defaultParams: iAuthentication = {
    appKey: 'web',
    waitAuthentication: false,
    accessToken: undefined,
    anticafeToken: undefined,
    userId: undefined,
    vkUserId: undefined,
    isAdmin: false,
    isDeveloper: false
}

export default class MainEntity extends Record(defaultParams) {

    constructor(params?: iAuthentication) {
        params ? super(params) : super()
    }

    setApp(appKey: iAppKey)  {
        return this.set('appKey', appKey) as this
    }

    setTokens(vkAuth?: iAnticafeAuthResponse) {
        return this
            .set('anticafeToken', vkAuth && vkAuth.anticafe_token)
            .set('accessToken', vkAuth && vkAuth.access_token)
            .set('vkUserId', vkAuth && vkAuth.user_id)
            .set('appKey', vkAuth && vkAuth.appKey)
            .set('isAdmin', vkAuth && vkAuth.isAdmin)
            .set('isDeveloper', vkAuth && vkAuth.isDeveloper) as this
    }

    setWaitAuthentication(waitAuthentication: boolean = false) {
        return this.set('waitAuthentication', waitAuthentication) as this
    }

    setUserId(id: string) {
        return this.set('userId', id) as this
    }
}