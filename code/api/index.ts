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
        debugger
        const { url, method, data } = params
        const config = yield Api.GetHeader({ url, method })

        try {

            const request = { method, baseURL, url, data, ...config }
            debugger
            const { data: result } = yield call(axios, request)

            if (result.error && result.error.message === 'maxAge exceeded') {
                return yield call(refreshAccessToken, params)

            } else {
                return result
            }

        }
        catch (error) {debugger
            return { error }
        }
    }

    static GetHeader = function* (params: any) {
        debugger
        console.log('cinf')
        let config = {}

        //const { options } = this.params

        if (/api\/protected\//i.test(params.url)) {
            yield call(authorizationHeader, config)
        }

        /*if(options && options.contentType) {
            config.headers.contentType = options.contentType
        }*/
        debugger
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

