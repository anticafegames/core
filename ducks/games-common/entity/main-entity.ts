import { List, Record } from "immutable"
import { gameKey, iReconnectGameState } from "./interface"

export interface iMainEntity {
    readyUsers: List<string>
    usersCount: number
    game?: gameKey
}

const defaultParams: iMainEntity = {
    readyUsers: List([]),
    usersCount: 0,
    game: undefined
}

export default class MainEntity extends Record(defaultParams) {

    constructor(params?: iMainEntity) {
        params ? super(params) : super()
    }

    waitReadyStart(readyUsers: string[], game: gameKey, usersCount: number) {
        return this
            .set('readyUsers', List(readyUsers))
            .set('game', game)
            .set('usersCount', usersCount) as this
    }

    waitReadyStop() {
        return this
            .set('readyUsers', List([]))
            .set('usersCount', 0) as this
    }

    userIsReady(userId: string) {

        if(!this.readyUsers.includes(userId)) {
            return this.updateIn(['readyUsers'], list => list.merge(list.push(userId))) as this
        }

        return this
    }

    stopGame() {
        return this.set('game', undefined) as this
    }

    reconnect(state: iReconnectGameState) {
        return this.set('game', state.gameKey)
    }

    get readyUsers() {
        return this.get('readyUsers') as string[]
    }
}