import { List, Record } from 'immutable'
import { gameKey } from './interface'

export interface iGame {
    gameKey?: gameKey,
    game?: any,
    gameReducer?: any
}

const defaultParams: iGame = {
    gameKey: undefined,
    game: undefined,
    gameReducer: undefined
}

export default class GameEntity extends Record(defaultParams) {

    constructor(params?: iGame) {
        params ? super(params) : super()
    }

    get gameKey() {
        return this.get('gameKey')
    }

    get game() {
        return this.get('game')
    }

    get gameReducer() {
        return this.get('gameReducer')
    }

    get gameCreated() {
        return !!this.game as boolean
    }

    createGame(gameKey: gameKey, game: any, reducer: any) {
        return this
            .set('gameKey', gameKey)
            .set('game', game)
            .set('gameReducer', reducer) as this
    }

    stopGame() {
        return this
            .set('gameKey', undefined)
            .set('game', undefined)
            .set('gameReducer', undefined) as this
    }

    reducer(action: any) {

        if(!this.gameCreated) return this

        return this
            .updateIn(['game'], game => this.gameReducer(game, action)) as this
    }
}