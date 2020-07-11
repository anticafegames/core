import { Record } from "immutable"

export interface iMessageListener {
    userId: string
    unbindSagaKey: string
}

const defaultParams: iMessageListener = {
    userId: '',
    unbindSagaKey: ''
}

export default class MessageListenerEntity extends Record(defaultParams) {

    constructor(params?: iMessageListener) {
        params ? super(params) : super()
    }
}