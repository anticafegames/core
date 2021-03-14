import { Record } from 'immutable'

import DebugParamsEntity, { iDebugRoomParams } from './debug-room-params-entity'

export interface iRegRoomParams {
    password?: string
    openRoom?: boolean
    hideRoomInSearch: boolean
    debugRoomParams?: DebugParamsEntity
}

export interface iCreateFormResult extends iRegRoomParams, iDebugRoomParams {}

export const defaultParams: iRegRoomParams = {
    password: '',
    openRoom: false,
    hideRoomInSearch: false,
    debugRoomParams: new DebugParamsEntity()
}

export class RegRoomEntity extends Record(defaultParams) {

    constructor(params: iCreateFormResult) {

        const debugParams = new DebugParamsEntity(params)
        params.debugRoomParams = debugParams

        super(params)
    }
}

export const getDefaultFormParams = (isDeveloper: boolean): Partial<iCreateFormResult> => ({
    openRoom: isDeveloper,
    debugMode: isDeveloper,
    withoutWebRTC: isDeveloper
})

export default (params: iCreateFormResult) => (new RegRoomEntity(params).toJS())
 
