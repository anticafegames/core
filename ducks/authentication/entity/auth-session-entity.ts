import { iUser, AuthUserEntity } from "./auth-user-entity"
import { Record } from "immutable"

export interface iSession {
    expire: number
    mid: number
    secret: string
    sid: string
    sig: string
    user: iUser | AuthUserEntity
}

export const defaultParams: iSession = {
    expire: 0,
    mid: 0,
    secret: '',
    sid: '',
    sig: '',
    user: new AuthUserEntity()
}

export class SessionEntity extends Record(defaultParams) {

    constructor(params?: iSession) {
        params ? super(params) : super()
    }
}