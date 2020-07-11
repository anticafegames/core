import { Record, List } from "immutable"

export interface iSocketStateEntity {
    socket?: SocketIOClient.Socket
    socketEvents?: List<string> | string[]
    userId?: string
}

export const defaultParams: iSocketStateEntity = {
    socket: undefined,
    socketEvents: List([]),
    userId: ''
}

export default class MainEntity extends Record(defaultParams) {

    constructor(params?: iSocketStateEntity) {
        params ? super(params) : super()
    }

    setSocket(socket?: SocketIOClient.Socket) {
        return this.set('socket', socket) as this
    }

    addSocketEvent(socketEvents: string[] = []) {

        let events = this.socketEvents 
        const needAdd = socketEvents.filter(item => !events.some(event => event === item))
        return this.updateIn(['socketEvents'], list => list.merge(list.push(...needAdd))) as this
    }

    deleteSocketEvent(socketEvents: string[] = []) {

        let events = this.socketEvents

        while(socketEvents.length) {

            const value = socketEvents.pop()
            const index = events.findIndex(item => item === value)

            if(index !== -1) {
                events = events.deleteIn([index])
            }
        }

        return this.set('socketEvents', events) as this
    }

    get socketEvents() {
        return this.get('socketEvents') as List<string>
    }
}
