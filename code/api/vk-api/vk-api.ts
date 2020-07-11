import { call, all, select } from 'redux-saga/effects'

import { waitCallback } from '../../ducks/saga-helper'
import { AuthUserEntity } from '../../../ducks/authentication/entity/auth-user-entity'
import { iAuthVkResponse } from '../../../ducks/authentication/entity/interface'
import PeerEntity from '../../../ducks/webrtc-room/entity/room-peer-entity'
import { vkApiVersion, defaultPhoto, vkApiUrl } from '../../../config/vk-config'
import { errorMessage, infoMessage } from '../../messages'
import { iPeerRoomSocketResponse } from '../../../ducks/webrtc-room/entity/room-peer-entity'
import { accessTokenSelector, userIdSelector } from '../../../ducks/authentication'
import Api from '..'
import { iResult } from '../../common/interfaces'

declare const VK: any

//https://vk.com/dev/photo_sizes
type sizeType = 'photo_75' | 'photo_130' | 'photo_604' | 'photo_807' | 'photo_1280'

export default class VKApi {

    static login = function* () {
        return yield call(waitCallback, (emit: any) => VK.Auth.login((response: iAuthVkResponse) => emit(response) , 5))
    }

    static logout = function* () {
        return yield call(waitCallback, (emit: any) => VK.Auth.logout((response: iAuthVkResponse) => emit(response)))
    }

    static getLoginStatus = function* () {
        return yield call(waitCallback, (emit: any) => VK.Auth.getLoginStatus((response: iAuthVkResponse) => emit(response)))
    }

    static getUser = function* (userId: number) {

        const { error, response } = yield call(VKApi.call, 'users.get', { user_ids: userId, fields: 'photo_50,nickname' })
        if(error) return null

        return response[0]
    }

    static getUsers = function* (userIds: number[]) {

        const { error, response } = yield call(VKApi.call, 'users.get',  { user_ids: userIds.join(','), fields: 'photo_50,nickname' })
        if(error) return null

        return response
    }

    static loadPhotoLinkById = function* (photoId: string, sizeType: sizeType) {
        
        const { error, response } = yield call(VKApi.call, 'photos.getById', `photos=${photoId}`)
        
        if(!error) {

            const photo = response[0]
            return photo[sizeType]
        }

        return null
    }

    static loadUserEntity = function* (userId: number) {

        try {

            const user = yield call(VKApi.getUser, userId)
            const id = yield select(userIdSelector)

            if(user) {

                user.vkId = user.id
                user.id = id

                user.profilePhoto = user.photo_50 || defaultPhoto
                return new AuthUserEntity(user)
            }
        } 
        catch {
            errorMessage(`Не удалось загрузить пользователя ${userId}`)
        }

        return null
    }

    static loadRoomPeers = function* (usersSocketResponse: iPeerRoomSocketResponse[]) {

        try {
            const usersData = yield call(VKApi.getUsers, usersSocketResponse.map(user => user.vkId))

            if(usersData) {

                const users = usersSocketResponse.map(userResponse => {

                    const userData = { ...usersData.find((item: any) => +item.id === +userResponse.vkId) }
                    const vkId = userData.id

                    userData.id = userResponse.id
                    userData.vkId = vkId

                    userData.profilePhoto = userData.photo_50 || defaultPhoto

                    return new PeerEntity(userData)
                })

                return users
            }
        }
        catch(error) {
            errorMessage(`Не удалось загрузить пользователя ${usersSocketResponse.map(user => user.id).join(';')}`, error)
        }

        return []
    }

    static call = function* (method: string, params: any) {
        
        const access_token = yield select(accessTokenSelector)

        params.access_token = access_token
        params.v = vkApiVersion
        
        const { error, result } = (yield call(Api.JSONP, `${vkApiUrl}method/${method}`, params)) as iResult<any>

        if(error) {
            errorMessage(error)
            return { error }
        }

        const response: any[] = result.response
        return { response }
    }
}