import axios from 'axios'
import { call, put, takeEvery, all, select, take } from 'redux-saga/effects'
import jwt from 'jwt-decode'

import { accessTokenSelector, LOG_IN_SUCCESS, AUTH_SUCCESS, AUTH_REQUEST, waitAuthenticationSelector } from '../../ducks/authentication'
import { errorMessage } from '../messages'
import Api from './index'
import { apiUrl as baseURL } from '../../config/app-config'
import LocalStorage from '../local-storage'
import Router from '../common/router'

export const authorizationHeader = function* (config: any) {

    const isWaitAuthentication = yield select(waitAuthenticationSelector)

    if (isWaitAuthentication)
        yield take(AUTH_SUCCESS)

    const token = yield select(accessTokenSelector)

    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
}

export const refreshAccessToken = function* (request?: any) {

    const refreshToken = yield call(LocalStorage.getObjectFromStorage, 'refresh_token')

    if (!refreshToken) {
        return Router.replace('/uthentication')
    }

    yield put({
        type: AUTH_REQUEST
    })

    try {

        const { data: { error, result: resultTokens } } = yield axios({ method: 'POST', baseURL, url: 'refresh-token', data: { refreshToken } })

        if (error) {
            return Router.replace('/auth')
        }

        const { user } = jwt(resultTokens.access_token)

        yield put({
            type: LOG_IN_SUCCESS,
            payload: { user, access_token: resultTokens.access_token }
        })

        LocalStorage.setObjectToStorage(resultTokens.refresh_token, 'refresh_token')

        yield put({
            type: AUTH_SUCCESS
        })

        if (request)
            return yield call(Api.RequestSaga, request)


    } catch (ex) {
        errorMessage(ex)

        yield put({
            type: AUTH_SUCCESS
        })
    }
}