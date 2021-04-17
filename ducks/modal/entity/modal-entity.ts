import { List, Record } from "immutable"
import React from 'react'

import ParamsEntity, { iModalParams } from './modal-params-entity'

export interface iModalEntity {
    key: string
    render: (closeModal: () => void) => JSX.Element
    params?: iModalParams
}

const defaultParams: iModalEntity = {
    key: '',
    render: () => React.createElement('div'),
    params: undefined
}

export default class ModalEntity extends Record(defaultParams) {

    constructor(params: iModalEntity) {
        params.params = new ParamsEntity(params.params)
        super(params)
    }

    toobject() {
        return this.toJS() as iModalEntity
    }
}