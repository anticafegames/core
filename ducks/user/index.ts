import { appName } from '../../config/app-config'
import { createSelector } from 'reselect'
import { call, put, takeEvery, all, select, take } from 'redux-saga/effects'
import VKApi from '../../code/api/vk-api/vk-api'
import { waitAuthenticationSelector, AUTH_SUCCESS, vkUserIdSelector, LOG_OUT_SUCCESS, USERID_SOCKET_EVENT } from '../authentication'
import MainEntity, { iMainEntity } from './entity/main-entity'

/*
*   Contstants 
*/

export const moduleName = 'user'

const prefix = `${appName}/${moduleName}`

export const LOAD_USER_REQUEST = `${prefix}/LOAD_USER_REQUEST`
export const LOAD_USER_SUCCESS = `${prefix}/LOAD_USER_SUCCESS`

export const CHANGE_USERID = `${prefix}/CHANGE_USERID`

/*
*   Reducer
*/


export default function reducer(state = new MainEntity(), action: any) {
    const { type, payload } = action

    switch (type) {

        case LOAD_USER_REQUEST:
            return state
                .setLoading(true, false)

        case LOG_OUT_SUCCESS:
            return state
                .setUser()
                .setLoading(false, false)

        case LOAD_USER_SUCCESS:
            return state
                .setUser(payload.user)
                .setLoading(false, !!payload.user)

        case USERID_SOCKET_EVENT:
            return state
                .changeUserId(payload.userId)
                

        default:
            return state

    }
}

/*
*   Selectors
*/

export const stateSelector = (state: any) => state[moduleName] as iMainEntity
export const userSelector = createSelector(stateSelector, state => state.user)

export const loadingSelector = createSelector(stateSelector, state => state.loading)
export const loadedSelector = createSelector(stateSelector, state => state.loaded)

export const isAuthorizedSelector = createSelector(
    userSelector,
    (user) => !!user
)

/*
*   Action Creaters
*/

/*
*   Sagas
*/

export function* loadUserSaga(): any {

    const vkUserId = yield select(vkUserIdSelector)

    if (vkUserId) {

        const user = yield call(VKApi.loadUserEntity, vkUserId)

        yield put({
            type: LOAD_USER_SUCCESS,
            payload: { user }
        })
    }
}

export function* saga() {
    yield all([
        takeEvery(LOAD_USER_REQUEST, loadUserSaga)
    ])
}