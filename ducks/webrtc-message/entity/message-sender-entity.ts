import { Record } from 'immutable'

export interface iMessageSender {
    id: string
    first_name: string
    last_name: string
    href: string
    profilePhoto: string 
}

export const defaultParams: iMessageSender = {
    id: '',
    first_name: '',
    last_name: '',
    href: '',
    profilePhoto: '' 
}

export default class MessageSenderEntity extends Record(defaultParams) {

    constructor(params?: iMessageSender) {
        params ? super(params) : super()
    }
}