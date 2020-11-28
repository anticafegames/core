import { Record } from 'immutable'
import { AuthUserEntity, iUser } from '../../authentication/entity/auth-user-entity'

export interface iMainEntity {
    user?: AuthUserEntity | iUser,
    loading: false,
    loaded: false
}

export const defaultParams: iMainEntity = {
    user: undefined,
    loading: false,
    loaded: false
}

export default class MainEntity extends Record(defaultParams) {

    constructor(params?: iMainEntity) {
        params ? super(params) : super()
    }

    setUser(user?: iUser) {
        return this.set('user', user) as this
    }

    setLoading(loading: boolean = false, loaded: boolean = true) {
        return this.set('loading', loading).set('loaded', loaded) as this
    }

    changeUserId(userId: string) {
        
        const user = this.user

        if(user) {
            return this.setIn(['user', 'id'], userId) as this
        }

        return this
    }

    get user() {
        return this.get('user') as AuthUserEntity
    }
}
