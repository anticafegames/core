import { List, Record } from 'immutable'

import MessageListenerEntity, { iMessageListener } from './message-listener-entity'
import MessageEntity, { iMessage } from './message-entity'

export interface iMainEntity {
    listeners: List<MessageListenerEntity>,
    messages: List<MessageEntity>
} 

export const defaultParams: iMainEntity = {
    listeners: List([]),
    messages: List([])
}

export default class MainEntity extends Record(defaultParams) {

    constructor(params?: iMainEntity) {
        params ? super(params) : super()
    }

    addMessage(message: iMessage) {
        return this.updateIn(['messages'], list => list.push(new MessageEntity(message))) as this
    }

    addListener(listener: iMessageListener) {
        return this.updateIn(['listeners'], list => list.push(new MessageListenerEntity(listener))) as this
    }
}

export const ReducerRecord = Record({
    listeners: List([]),
    messages: List([])
})