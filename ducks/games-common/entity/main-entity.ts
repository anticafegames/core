import { List, Record } from 'immutable'

import { gameKey, iReconnectGameState } from './interface'
import GameEntity from './game-entity'

export interface iMainEntity {
    readyUsers: List<string>
    usersCount: number
    game?: GameEntity
}

const defaultParams: iMainEntity = {
    readyUsers: List([]),
    usersCount: 0,
    game: new GameEntity()
}

export default class MainEntity extends Record(defaultParams) {

    constructor(params?: iMainEntity) {
        params ? super(params) : super()
    }

    waitReadyStart(readyUsers: string[], usersCount: number) {
        return this
            .set('readyUsers', List(readyUsers))
            .set('usersCount', usersCount) as this
    }

    waitReadyStop() {
        return this
            .set('readyUsers', List([]))
            .set('usersCount', 0) as this
    }

    createGameEntity(gameKey: gameKey, game: any, reducer: any) {
        return this
            .updateIn(['game'], (gameEntity: GameEntity) => gameEntity.createGame(gameKey, game, reducer)) as this
    }

    userIsReady(userId: string) {

        if(!this.readyUsers.includes(userId)) {
            return this.updateIn(['readyUsers'], list => list.merge(list.push(userId))) as this
        }

        return this
    }

    stopGame() {
        return this
            .updateIn(['game'], (game: GameEntity) => game.stopGame()) as this
    }

    gameReducer(action: any) {
        return this
            .updateIn(['game'], (game: GameEntity) => game.reducer(action)) as this
    }

    get readyUsers() {
        return this.get('readyUsers') as string[]
    }

    get gameCreated() {
        return this.gameEntity.gameCreated
    }

    get gameEntity() {
        return this.get('game') as GameEntity
    }
}