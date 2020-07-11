import { Record, List } from 'immutable'

import messageSenderEntity, { iMessageSender } from './message-sender-entity'

export interface iMessage {
    sender: iMessageSender | messageSenderEntity,
    text: string
}

export const defaultParams: iMessage = {
    sender: new messageSenderEntity(),
    text: ''
}

export default class MessageEntity extends Record(defaultParams) {

    constructor(params?: iMessage) {

        if(!params) {
            super()
            return
        }

        params.sender = new messageSenderEntity(params.sender as iMessageSender)
        super(params)
    }

}
