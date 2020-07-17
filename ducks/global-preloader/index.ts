import { appName } from '../../config/app-config'
import { vkAppId } from '../../config/vk-config'
import { createSelector } from 'reselect'
import { Record, OrderedMap, List } from 'immutable'
import { call, put, takeEvery, all, select, take, race, fork, delay } from 'redux-saga/effects'
import { hash, guid } from '../../code/hash'

declare const VK: any

import Store, { iMainEntity } from './entity/main-entity'
import PreloaderEntity, { iPreloader, firstPreloaderParams } from './entity/preloader-entity'

/*
*   Contstants 
*/

export const moduleName = 'global-preloader'

const prefix = `${appName}/${moduleName}`

export const SHOW_PRELOADER = `${prefix}/SHOW_PRELOADER`
export const HIDE_PRELOADER = `${prefix}/HIDE_PRELOADER`

/*
*   Reducer
*/

export default function reducer(state = new Store(), action: any) {
    const { type, payload } = action

    switch (type) {

        case SHOW_PRELOADER:
            return state.addPreloader(payload.preloader)

        case HIDE_PRELOADER:
            return state.deletePreloader(payload.hidePreloaderSagaKey)

        default: 
            return state

    }
}

/*
*   Selectors
*/

export const stateSelector = (state: any) => state[moduleName] as iMainEntity
export const showPreloaderSelector = createSelector(stateSelector, state => (state.preloaders as List<PreloaderEntity>).size !== 0)
export const opacity100Selector = createSelector(stateSelector, state => (state.preloaders as List<PreloaderEntity>).some(preloader => preloader!.opacity100))

/*
*   Action Creaters
*/



/*
*   Sagas
*/

export function* showGlobalPreloader(message: string, hidePreloaderKey: string, delay?: number, opacity100: boolean = false) {
    const hidePreloaderSagaKey = getHidePreloaderSagaKey(hidePreloaderKey)
    yield fork(showGlobalPreloaderSaga, message, hidePreloaderSagaKey, delay, opacity100)
    return hidePreloaderSagaKey
}

export function* showGlobalPreloaderSaga(message: string, hidePreloaderSagaKey: string, delayTime: number = 1000, opacity100: boolean = false) {

    const { delayRace, unbind } = yield race({
        delayRace: delay(delayTime),
        unbindEvent: take(hidePreloaderSagaKey)
    })

    if(delayRace) {
        const preloader: iPreloader = { message, hidePreloaderSagaKey, opacity100 }

        yield fork(listenHidePreloader, preloader)

        yield put({
            type: SHOW_PRELOADER,
            payload: { preloader }
        })
    }
}

export function* listenHidePreloader(preloader: iPreloader) {

    const hidePreloaderSagaKey = preloader.hidePreloaderSagaKey
    
    yield take(preloader.hidePreloaderSagaKey)
    
    yield put({
        type: HIDE_PRELOADER,
        payload: { hidePreloaderSagaKey }
    })
}

export function* hidePreloader(hidePreloaderSagaKey: string) {
    yield put({ type: getHidePreloaderSagaKey(hidePreloaderSagaKey) })
}

export const getHidePreloaderSagaKey = (hidePreloaderKey: string) => `${appName}/${moduleName}/HIDE_GLOBAL_PRELOADER/${hidePreloaderKey}` 

export function* listenFirstPreloader() {
    const preloader = firstPreloaderParams
    yield call(listenHidePreloader, preloader)
}

export function* saga() {
    yield all([
        listenFirstPreloader()
    ])
}