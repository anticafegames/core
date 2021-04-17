import { setupMaster } from 'cluster'
import { List, Record } from 'immutable'

export interface iSettingsParams {
    timer: number
    pack: string
}

const defaultParams: iSettingsParams = {
    timer: 300,
    pack: ''
}

export default class SettingsParamsEntity extends Record(defaultParams) {

    constructor(params?: iSettingsParams) {
        params ? super(params) : super()
    }

    toJS(): iSettingsParams {
        return super.toJS()
    }
}