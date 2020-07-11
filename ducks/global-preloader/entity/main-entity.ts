import { List, Record } from "immutable"
import PreloaderEntity, { iPreloader, firstPreloaderEntity } from "./preloader-entity"

export interface iMainEntity {
    preloaders: iPreloader[] | List<PreloaderEntity>
}

const defaultParams: iMainEntity = {
    preloaders: List([firstPreloaderEntity])
}

export default class MainEntity extends Record(defaultParams) {

    constructor(params?: iMainEntity) {
        params ? super(params) : super()
    }

    addPreloader(preloader: iPreloader) {
        return this.updateIn(['preloaders'], list => list.push(new PreloaderEntity(preloader))) as this
    }

    deletePreloader(hidePreloaderSagaKey: string) {
        const preloaders: List<iPreloader> = this.getPreloaders()
        const preloaderIndex = preloaders.findIndex(preloader => preloader!.hidePreloaderSagaKey === hidePreloaderSagaKey)
        return this.deleteIn(['preloaders', preloaderIndex]) as this
    }

    getPreloaders() {
        return this.get('preloaders')
    }
}