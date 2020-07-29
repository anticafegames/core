import axios from 'axios'
import jsonp from 'jsonp'
import { call, put, takeEvery, all, select } from 'redux-saga/effects'


import { apiUrl as baseURL } from '../../config/app-config'
import { refreshAccessToken, authorizationHeader } from './auth'

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
        
        const { url, method, data, options } = params

        const config = yield call(Api.GetConfig, { url, method, options })

        try {
            
            const request = { method, baseURL, url, data, ...config }
            
            const { data: result } = yield axios(request)
            
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

    static GetConfig = function* (params: any) {

        let config = yield call(Api.GetHeader, params)

        const { options } = params

        if(options) {

            if(options.baseURL) {
                config.baseURL = options.baseURL
            }
        }

        return config
    }

    static GetHeader = function* (params: any) {
        
        let config = {}

        if (/api\/protected\//i.test(params.url)) {
            yield call(authorizationHeader, config)
        }
        
        return config
    }

    static setPatamsToUrl(url: string, params: any) {

        const keys = Object.keys(params)

        if(keys.length) {
            url += '?'
            keys.forEach((key, index) => url += `${key}=${params[key]}${index !== key.length - 1 && '&'}`)
        }

        return url 
    }
}

