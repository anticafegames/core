import { List, Record } from "immutable"
import React from 'react'

import { guid } from "../../../../code/common/hash"

import ModalEntity from './modal-entity'
import ParamsEntity, { iModalParams } from './modal-params-entity'

export interface iMainEntity {
    modalList: List<ModalEntity>
}

const defaultParams: iMainEntity = {
    modalList: List()
}

export default class MainEntity extends Record(defaultParams) {

    constructor(params?: iMainEntity) {
        params ? super(params) : super()
    }

    showElement(render: (closeModal: () => void) => JSX.Element, params?: iModalParams) {
        return this.update('modalList', (list: List<ModalEntity>) => list.merge(list.unshift(new ModalEntity({ key: guid(), render, params })))) as this
    }

    closeElement() {
        return this.update('modalList', (list: List<ModalEntity>) => {
            if(!list.size) return list
            return list.deleteIn([0])
        }) as this
    }

    get currentModal() {

        const list = this.get('modalList') as List<ModalEntity>
        const modal = list.get(0)

        return modal && modal.toobject()
    }
}