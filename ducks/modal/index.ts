import { appName } from '../../config/app-config'
import MainEntity, { iMainEntity } from './entity/main-entity'
import { createSelector } from 'reselect'
import { iModalParams } from './entity/modal-params-entity'

/*
*   Contstants 
*/

export const moduleName = 'modal-window'

const prefix = `${appName}/${moduleName}`

export const SHOW_MODAL = `${prefix}/SHOW_MODAL`
export const CLOSE_MODAL = `${prefix}/CLOSE_MODAL`

/*
*   Reducer
*/

export default function reducer(state = new MainEntity(), action: any) {
    const { type, payload } = action

    switch (type) {

        case SHOW_MODAL:
            return state.showElement(payload.render, payload.params)

        case CLOSE_MODAL:
            return state.closeElement()

        default: 
            return state

    }
}

/*
*   Selectors
*/

export const stateSelector = (state: any) => state[moduleName] as iMainEntity

export const renderSelector = createSelector(stateSelector, state => state.render)
export const paramsSelector = createSelector(stateSelector, state => state.params)

/*
*   Action Creaters
*/

export function showElement(render: (closeModel: () => void) => JSX.Element, params?: iModalParams) {

    return {
        type: SHOW_MODAL,
        payload: { render, params }
    }
}

export function closeElement() {
    return {
        type: CLOSE_MODAL
    }
}

/*
*   Sagas
*/

export function* saga() {}