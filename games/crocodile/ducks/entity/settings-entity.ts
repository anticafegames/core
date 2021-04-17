import { List, Record } from 'immutable'

import { iPack } from './interface'
import SettingsParamsEntity, { iSettingsParams } from './settings-params-entity'

export interface iSettings {
    params: SettingsParamsEntity

    packs?: List<iPack>
    packsloading: boolean
}

const defaultParams: iSettings = {
    params: new SettingsParamsEntity(),

    packs: undefined,
    packsloading: false
}

export default class DataForSettingsEntity extends Record(defaultParams) {

    constructor(params?: iSettings) {
        params ? super(params) : super()
    }

    setPacks(packs: iPack[]) {
        return this
            .set('packs', List(packs))
            .set('packsloading', false) as this
    }

    setPacksLoading(loading: boolean) {
        return this
            .set('packsloading', loading) as this
    }

    setParams(settings: iSettingsParams) {
        return this
            .set('params', new SettingsParamsEntity(settings)) as this
    }
}