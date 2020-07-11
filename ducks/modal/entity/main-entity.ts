import { List, Record } from "immutable"
import React from 'react'

import ParamsEntity, { iModalParams } from './modal-params-entity'

export interface iMainEntity {
    render?: (closeModal: () => void) => JSX.Element
    params?: ParamsEntity | iModalParams
}

const defaultParams: iMainEntity = {
    render: undefined,
    params: undefined
}

export default class MainEntity extends Record(defaultParams) {

    constructor(params?: iMainEntity) {
        params ? super(params) : super()
    }

    showElement(element: JSX.Element, params?: iModalParams) {
        return this.set('render', element).set('params', new ParamsEntity(params)) as this
    }

    closeElement() {
        return this.set('render', undefined).set('params', undefined) as this
    }
}