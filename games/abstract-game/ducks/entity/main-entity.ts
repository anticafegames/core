import { List, Record } from "immutable"

export interface iMainEntity {
    
}

const defaultParams: iMainEntity = {

}

export default class MainEntity extends Record(defaultParams) {

    constructor(params?: iMainEntity) {
        params ? super(params) : super()
    }
}