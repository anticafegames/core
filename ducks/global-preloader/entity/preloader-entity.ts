import { Record } from "immutable"
import { appName } from "../../../config/app-config"

export interface iPreloader {
    message: string
    hidePreloaderSagaKey: string
    opacity100: boolean
}

const defaultParams: iPreloader = {
    message: '',
    hidePreloaderSagaKey: '',
    opacity100: false
}

export default class PreloaderEntity extends Record(defaultParams) {

    constructor(params?: iPreloader) {
        params ? super(params) : super()
    } 

    get hidePreloaderSagaKey() {
        return this.get('hidePreloaderSagaKey') as string
    }

    get opacity100() {
        return this.get('opacity100') as boolean
    }
}

export const firstPreloaderParams: iPreloader = {
    hidePreloaderSagaKey: `${appName}/global-preloader/HIDE_GLOBAL_PRELOADER/firstpreloader`,
    message: "firstpreloader",
    opacity100: true
}

export const firstPreloaderEntity = new PreloaderEntity(firstPreloaderParams)