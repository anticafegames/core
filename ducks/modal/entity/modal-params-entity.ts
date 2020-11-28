import { List, Record } from "immutable"
import React from 'react'

export interface iModalParams {
    className?: string
    styled?: any
    canCloseOnOverlay?: boolean
    withFooter?: boolean
}

const defaultParams: iModalParams = {
    className: '',
    canCloseOnOverlay: true,
    withFooter: true,
    styled: null
}

export default class MainEntity extends Record(defaultParams) {

    constructor(params?: iModalParams) {
        params ? super(params) : super()
    }

    get className() {
        return this.get('className') as string
    }

    get canCloseOnOverlay() {
        return this.get('canCloseOnOverlay') as boolean
    }
}