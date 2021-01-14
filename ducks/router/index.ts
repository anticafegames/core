import { appName } from '../../config/app-config'
import { vkAppId } from '../../config/vk-config'
import { createSelector } from 'reselect'
import { Record, OrderedMap, List } from 'immutable'
import { call, put, takeEvery, all, select, take } from 'redux-saga/effects'

/*
*   Contstants 
*/

export const moduleName = 'router'

const prefix = `${appName}/${moduleName}`

/*
*   Reducer
*/



/*
*   Selectors
*/

export const stateSelector = (state: any) => state[moduleName]
export const locationSelector = createSelector(stateSelector, state => state.location)
export const querySelector = createSelector(locationSelector, state => state.query)
export const hashSelector = createSelector(locationSelector, state => state.hash)
export const pathnameSelector = createSelector(locationSelector, state => state.pathname)

/*
*   Action Creaters
*/



/*
*   Sagas
*/

