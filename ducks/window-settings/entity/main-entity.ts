import { List, Record } from "immutable"

export interface iMainEntity {
    windowWidth: number
    windowHeight: number
}

export const defaultParams: iMainEntity = {
    windowWidth: 1000,
    windowHeight: 1000
}

export default class MainEntity extends Record(defaultParams) {

    constructor(params?: iMainEntity) {
        params ? super(params) : super()
    }

    setSize(width: number, height: number) {
        return this
            .set('windowWidth', width)
            .set('windowHeight', height) as this
    }
}