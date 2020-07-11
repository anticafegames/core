import { delay } from 'redux-saga'
import { call, select, take, put, race } from 'redux-saga/effects'
import bridge from '@vkontakte/vk-bridge'

import { waitCallback, errorSagaKey, waitSuccess } from '../../ducks/saga-helper'
import { iAuthVkResponse, iAppKey } from '../../../ducks/authentication/entity/interface'
import Api from '../../api'
import VKApi from './vk-api'
import { waitAuthenticationSelector, AUTH_SUCCESS, LOG_IN_SUCCESS, AUTH_REQUEST } from '../../../ducks/authentication'
import { isAuthorizedSelector } from '../../../ducks/authentication'
import { vkAppId, regexVkHash, vkAuthUrl, vkAuthPopupParams, vkMiniAppKey, vkGameAppKey } from '../../../config/vk-config'
import { loadUserSaga, userSelector, LOAD_USER_SUCCESS } from '../../../ducks/user'
import { infoMessage, errorMessage } from '../../messages'
import { iVkAuth, iAnticafeAuthResponse } from './interface'
import { iResult } from '../../common/interfaces'
import LocalStorage from '../../local-storage'
import { querySelector } from '../../../ducks/router'
import jwt_decode from 'jwt-decode'
import { messageToast } from '../../alerts/toast'
import openRedirectToBrouser from '../../modals/redirect-to-brouser'

declare const window: any
declare const VK: any

type loginMode = 'check' | 'login'

export function* login(loginMode: loginMode) {

    const waitAuthentication = yield select(waitAuthenticationSelector)
    if (waitAuthentication) return 'waitAuthentication'

    yield put({ type: AUTH_REQUEST })

    const action = loginMode === 'check' ? checkLoginAction : loginAction
    const { error, result }: iResult<iAnticafeAuthResponse> = yield call(action)

    if (!error) {

        yield put({
            type: LOG_IN_SUCCESS,
            payload: { vkAuth: result }
        })

        LocalStorage.setObjectToStorage(result!.anticafe_token, 'anticafeToken')
        yield call(loadUserSaga)

    } else {

        if (loginMode === 'login') {
            messageToast(error)
        }

        yield put({
            type: errorSagaKey(LOG_IN_SUCCESS),
            payload: { error }
        })
    }

    yield put({ type: AUTH_SUCCESS })
    return !error
}

function* loginAction() {

    const vkAuth: iVkAuth = yield call(waitVkAuth)
    if (!vkAuth) return

    vkAuth.appKey = 'web'

    return yield call(Api.POST, 'vk-auth-new', { vkAuth })
}

function* checkLoginAction() {

    const query = yield select(querySelector)
    const { vk_app_id, api_id, user_id, access_token } = query

    const appKey = getAppKey(+vk_app_id || +api_id)
    let action: any

    switch (appKey) {

        case 'web':
            console.log('checkLoginWeb')
            action = checkLoginWeb
            break

        case 'vk-app':
            console.log('checkLoginMiniApp')
            action = checkLoginMiniApp
            break

        case 'vk-game':
            console.log('checkLoginGameApp')
            action = checkLoginGameApp
            break

    }

    return yield call(action!, query)
}

function* checkLoginWeb(query: any) {

    const token = LocalStorage.getObjectFromStorage('anticafeToken')

    if (token) {
        return yield call(Api.POST, 'verify-anticafe-token', { token, appKey: 'web' })
    }

    return { error: 'Нет токена' }
}

function* checkLoginMiniApp(query: any) {

    const { vk_app_id: app_id, vk_user_id: user_id } = query

    yield bridge.sendPromise('VKWebAppInit', {})

    if (bridge.isWebView()) {
        yield put(openRedirectToBrouser())
        return { error: 'Открыто в приложение' }
    }

    const tokenResponce = yield bridge.sendPromise('VKWebAppGetAuthToken', { app_id: +app_id, "scope": "" })
    const { access_token } = tokenResponce

    const vkAuth: iVkAuth = { access_token, user_id: +user_id, appKey: 'vk-app', expires_in: 10000 }
    return yield call(Api.POST, 'vk-auth-new', { vkAuth })
}

function* checkLoginGameApp(query: any) {

    const { access_token, user_id, viewer_id, platform } = query

    if(platform !== 'web') {
        yield put(openRedirectToBrouser())
        return { error: 'Открыто в приложение' }
    }

    const vkAuth: iVkAuth = { access_token, user_id: +(user_id == 0 ? viewer_id : user_id), appKey: 'vk-app', expires_in: 10000 }
    return yield call(Api.POST, 'vk-auth-new', { vkAuth })
}

function* waitVkAuth() {

    const { delayRace, callback } = yield race({
        delay: delay(180000),
        callback: waitCallback((emit: any) => {
            window['VkAuth'] = (hash: string) => emit(hash)
            window.open(vkAuthUrl, 'Anticafe', vkAuthPopupParams)
        })
    })

    window['VkAuth'] = null

    if (delayRace) {
        alert('VK AUTH DELAY')
        return
    }

    const hash = callback

    return vkHashToObject(hash)
}

function vkHashToObject(hash: string) {
    if (!regexVkHash.test(hash)) {
        errorMessage('Invalid VK Token')
        return
    }

    hash = hash.substring(1, hash.length)
    const [, access_token, , expires_in, , user_id] = hash.split(/\&|\=/)

    return { access_token, expires_in: +expires_in, user_id: +user_id } as iVkAuth
}

export function* waitAuthentication(waitLogIn: boolean, waitLoadUser: boolean) {

    const waitAuthentication = yield select(waitAuthenticationSelector)

    if (waitAuthentication) {
        infoMessage('Ждем auth')
        yield call(waitSuccess, LOG_IN_SUCCESS)
    }

    if (waitLogIn) {

        const isAuthorized = yield select(isAuthorizedSelector)

        if (!isAuthorized) {

            const { error } = yield call(waitSuccess, LOG_IN_SUCCESS)

            if (error) {
                return false
            }
        }

        if (waitLoadUser) {

            const isAuthorized = yield select(isAuthorizedSelector)

            if (!isAuthorized) {
                return yield false
            }

            const isLoadUser = yield select(userSelector)

            if (!isLoadUser) {
                yield take(LOAD_USER_SUCCESS)
            }
        }
    }

    return yield true
}

function* waitLoadVkScript() {
    infoMessage('Ждем загрузку ВК скрипта')
    while (!window['VK']) {
        infoMessage('Ждем', window['VK'])
        yield delay(100)
    }
    infoMessage('Загрузили вк скрипт')
    return yield true
}

function getAppKey(id: number) {

    const webID = vkAppId
    const vkMiniAppID = vkMiniAppKey
    const vkGameAppId = vkGameAppKey

    let appKey: iAppKey

    switch (id) {

        case vkMiniAppID:
            appKey = 'vk-app'
            break;

        case vkGameAppId:
            appKey = 'vk-game'
            break;

        default:
            appKey = 'web'
            break;
    }

    return appKey
}

function* decodeToken(token: string) {
    if (!token) return
    return yield call(jwt_decode, token)
}