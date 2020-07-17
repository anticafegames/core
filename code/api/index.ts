import axios from 'axios'
import jsonp from 'jsonp'
import { call, put, takeEvery, all, select } from 'redux-saga/effects'
import jwt from 'jwt-decode'


import { accessTokenSelector, waitAuthenticationSelector, LOG_IN_SUCCESS, AUTH_SUCCESS, AUTH_REQUEST } from '../../ducks/authentication'
import { apiUrl as baseURL } from '../../config/app-config'
import LocalStorage from '../local-storage'
import { refreshAccessToken, authorizationHeader } from './auth'
import { iResult } from '../common/interfaces'

export default class Api {

    static GET = function* (url: string, data: any, options?: any) {
        const method = 'GET'
        return yield Api.RequestSaga({ url, method, data, options })
    }

    static POST = function* (url: string, data: any, options?: any) {
        const method = 'POST'
        return yield Api.RequestSaga({ url, method, data, options })
    }

    static DELETE = function* (url: string, data: any, options?: any) {
        const method = 'DELETE'
        return yield Api.RequestSaga({ url, method, data, options })
    }

    static JSONP = function* (url: string, params: any, options?: any) {

        url = Api.setPatamsToUrl(url, params)

        return yield new Promise((resolve) => {
            jsonp(url, options, (error, result) => {
               resolve({ error: error || result.error, result })
            });
        })
    }

    static RequestSaga = function* (params: any): Generator<any, any, any> {

        const { url, method, data } = params
        const config = yield call(Api.GetHeader, { url, method })

        try {

            const request = { method, baseURL, url, data, ...config }
            const { data: result } = yield call(axios, request)

            if (result.error && result.error.message === 'maxAge exceeded') {
                return yield call(refreshAccessToken, params)

            } else {
                return result
            }

        }
        catch (error) {
            return { error }
        }
    }

    static GetHeader = function* (params: any) {

        let config = {}

        //const { options } = this.params

        if (/api\/protected\//i.test(params.url)) {
            yield call(authorizationHeader, config)
        }

        /*if(options && options.contentType) {
            config.headers.contentType = options.contentType
        }*/

        return config
    }

    private static setPatamsToUrl(url: string, params: any) {

        const keys = Object.keys(params)

        if(keys.length) {
            url += '?'
            keys.forEach((key, index) => url += `${key}=${params[key]}${index !== key.length - 1 && '&'}`)
        }

        return url 
    }
}

