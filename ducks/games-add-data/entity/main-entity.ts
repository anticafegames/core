import { Record } from 'immutable'
import { gameKey } from '../../games-common/entity/interface'


export interface iPreviewToAddData {
    gameKey: gameKey,
    data: any
}

export interface iMainEntity {
    previewToAddData?: iPreviewToAddData
    loadingPreviewToAddData: boolean
}

const defaultParams: iMainEntity = {
    previewToAddData: undefined,
    loadingPreviewToAddData: false
}

export default class MainEntity extends Record(defaultParams) {

    constructor(params?: iMainEntity) {
        params ? super(params) : super()
    }

    setPreviewToAddData(data: iPreviewToAddData) {
        return this
            .set('previewToAddData', data)
            .set('loadingPreviewToAddData', false) as this
    }

    previewToAddDataLoading(loading: boolean) {
        return this.set('loadingPreviewToAddData', loading) as this
    }

    getobject(): iMainEntity {
        return this as any
    }
}