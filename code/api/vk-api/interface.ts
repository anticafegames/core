import { iAppKey } from '../../../ducks/authentication/entity/interface'

export interface iVkAuth {
    access_token: string
    expires_in: number
    user_id: number
    appKey: iAppKey
}

export interface iAnticafeAuthResponse {
    access_token: string
    user_id: number
    anticafe_token: string
    appKey: iAppKey
    isAdmin: boolean
}