import { List, Record } from "immutable"
import React from 'react'

export interface iModalParams {
    className?: string
    styles?: any
    canCloseOnOverlay?: boolean
    withFooter?: boolean
}

const defaultParams: iModalParams = {
    className: '',
    canCloseOnOverlay: true,
    withFooter: true
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