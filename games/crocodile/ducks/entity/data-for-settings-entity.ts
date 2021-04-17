import { List, Record } from 'immutable'

interface iPack {
    id: string,
    text: string
}

export interface iDataForSettings {
    packs: List<iPack>
}

const defaultParams: iDataForSettings = {
    packs: List([])
}

export default class DataForSettingsEntity extends Record(defaultParams) {

    constructor(params?: iDataForSettings) {
        params ? super(params) : super()
    }
}