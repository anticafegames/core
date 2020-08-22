import { appName } from '../../config/app-config'
import { vkAppId } from '../../config/vk-config'
import { createSelector } from 'reselect'
import { Record, OrderedMap, List } from 'immutable'
import { call, put, takeEvery, all, select, take, fork } from 'redux-saga/effects'
import { hash } from '../../code/common/hash'

declare const VK: any

import MainEntity, { iAuthentication } from './entity/main-entity'
import Api from '../../code/api'
import { refreshAccessToken } from '../../code/api/auth'
import LocalStorage from '../../code/local-storage'
import { errorMessage } from '../../code/messages'
import Auth from '../../code/api/vk-api/vk-api-helper'
import { iAuthVkResponse } from './entity/interface'
import { iSession } from './entity/auth-session-entity'
import VKApi from '../../code/api/vk-api/vk-api'
import { loadUserSaga, userSelector } from '../user'
import { bindSocketEvents } from '../../code/socket/bind-socket-events-helper'
import { iSocketAction } from '../socket/entity/interface'
import { showGlobalPreloader, hidePreloader } from '../global-preloader'

/*
*   Contstants 
*/

export const moduleName = 'authentication'

const prefix = `${appName}/${moduleName}`

export const LOG_IN_REQUEST = `${prefix}/LOG_IN_REQUEST`
export const LOG_IN_SUCCESS = `${prefix}/LOG_IN_SUCCESS`

export const LOG_OUT_REQUEST = `${prefix}/LOG_OUT_REQUEST`
export const LOG_OUT_SUCCESS = `${prefix}/LOG_OUT_SUCCESS`

export const AUTH_REQUEST = `${prefix}/AUTH_REQUEST`
export const AUTH_SUCCESS = `${prefix}/AUTH_SUCCESS`

export const USERID_SOCKET_EVENT = `${prefix}/USERID_SOCKET_EVENT`

/*
*   Reducer
*/

export default function reducer(state = new MainEntity(), action: any) {
    const { type, payload } = action

    switch (type) {

        case LOG_IN_SUCCESS:
            return state
                .setTokens(payload.vkAuth)
                .setWaitAuthentication(false)

        case LOG_OUT_SUCCESS:
            return state
                .setTokens()
                .setWaitAuthentication(false)

        case AUTH_REQUEST:
            return state.setWaitAuthentication(true)

        case AUTH_SUCCESS:
            return state.setWaitAuthentication(false)

        case USERID_SOCKET_EVENT:
            return state.setUserId(payload.userId)

        default:
            return state

    }
}

/*
*   Selectors
*/

export const stateSelector = (state: any) => state[moduleName] as iAuthentication

export const accessTokenSelector = createSelector(stateSelector, state => state.accessToken)
export const anticafeTokenSelector = createSelector(stateSelector, state => state.anticafeToken)
export const vkUserIdSelector = createSelector(stateSelector, state => state.vkUserId)
export const userIdSelector = createSelector(stateSelector, state => state.userId)

export const waitAuthenticationSelector = createSelector(stateSelector, state => state.waitAuthentication)
export const appKeySelector = createSelector(stateSelector, state => state.appKey)

export const isAuthorizedSelector = createSelector(accessTokenSelector, accessToken => !!accessToken)


/*
*   Action Creaters
*/

export function logIn() {
    return {
        type: LOG_IN_REQUEST
    }
}

export function logOut() {
    return {
        type: LOG_OUT_REQUEST
    }
}

/*
*   Sagas
*/

const socketActions: iSocketAction[] = [
    {
        socketKey: 'userId',
        sagaKey: USERID_SOCKET_EVENT
    }
]

export function* logInSaga() {

    yield call(Auth.waitAuthentication, false, false)

    const token: string = yield select(anticafeTokenSelector)
    
    if (token) {
        return true
    }
    
    return yield call(Auth.login, 'login')
}

export function* logOutSaga() {
    yield call(Auth.logout)
    yield put({ type: LOG_OUT_SUCCESS })
}

export function* vkAuthInit() {
    yield call(Auth.login, 'check')
    yield call(hidePreloader, 'firstpreloader')
}

export function* saga() {
    yield all([
        bindSocketEvents(socketActions),
        vkAuthInit(),
        takeEvery(LOG_IN_REQUEST, logInSaga),
        takeEvery(LOG_OUT_REQUEST, logOutSaga)
    ])
}