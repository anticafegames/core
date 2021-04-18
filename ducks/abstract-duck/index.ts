import { appName, gamePrefix } from '../../config/app-config'
import { createSelector } from 'reselect'
import { Record, OrderedMap, List } from 'immutable'
import { call, put, takeEvery, all, select, take } from 'redux-saga/effects'

import { bindSocketEvents } from '../../code/socket/bind-socket-events-helper'
import { iSocketResult, iSocketAction } from '../socket/entity/interface'
import { todo } from '../../code/messages'
import MainEntity, { iMainEntity } from './entity/main-entity'

/*
*   Contstants 
*/

export const moduleName = 'name'
export const socketPrefix = 'name'

const prefix = `${appName}/${moduleName}`

export const DEFAULT_CONST = `${prefix}/DEFAULT_CONST`

/*
*   Reducer
*/

export default function reducer(state = new MainEntity(), action: any) {

    const type = action.type
    const payload = action.payload

    switch (type) {

        default:
            return state

    }
}

/*
*   Selectors
*/

export const stateSelector = (state: any) => state[moduleName] as MainEntity

/*
*   Action Creaters
*/



/*
*   Sagas
*/

/*export const socketActions: iSocketAction[] = [

]*/

function* defaultSaga() {
    return yield true
}

export function* saga() {
    yield all([
        takeEvery(DEFAULT_CONST, defaultSaga)
    ])
}