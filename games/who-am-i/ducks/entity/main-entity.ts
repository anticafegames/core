import { List, Record } from "immutable"

import GameUserEntity, { iGameUser } from "./game-user-entity"
import { iGameState, iReconnectState } from './interface'

export interface iMainEntity {
    gameUsers: List<GameUserEntity> | iGameUser[]
    gameState: iGameState
    randomName: string
    fillNameLoading: boolean
    randomNameLoading: boolean
}

const defaultParams: iMainEntity = {
    gameUsers: List([]),
    gameState: 'undefined',
    randomName: '',
    fillNameLoading: false,
    randomNameLoading: false
}

export default class MainEntity extends Record(defaultParams) {

    constructor(params?: iMainEntity) {
        params ? super(params) : super()
    }

    prepareStart(gameUsers: iGameUser[]) {
        return this
            .set('gameUsers', List(gameUsers.map(user => new GameUserEntity(user))))
            .set('gameState', 'prepare') as this
    }

    startGame() {
        return this.set('gameState', 'game') as this
    }

    stopGame() {
        return this
            .set('gameUsers', List([]))
            .set('gameState', 'undefined') as this
    }

    reconnectGame(state: iReconnectState) {
        return this
            .set('gameUsers', List(state.users))
            .set('gameState', state.gameState) as this
    }

    filledMyName() {

        const users = this.getGameUsers()
        const index = users.findIndex(user => user!.itIsMe)

        return this.setIn(['gameUsers', index, 'nameFilled'], true)
    }

    filledName(userId: string, name: string) {

        const users = this.getGameUsers()
        const index = users.findIndex(user => user!.id === userId)
        if(index === -1) return this

        return this
            .setIn(['gameUsers', index, 'nameFilled'], true)
            .setIn(['gameUsers', index, 'name'], name)
            .set('fillNameLoading', false) as this
    }

    selectRandomName(name: string) {
        return this
            .set('randomName', name) 
            .set('randomNameLoading', false) as this
    }

    showMyName(name: string) {

        const users = this.getGameUsers()
        const index = users.findIndex(user => user!.itIsMe)
        if(index === -1) return this

        return this
            .setIn(['gameUsers', index, 'userSeesName'], true)
            .setIn(['gameUsers', index, 'name'], name) as this
    }

    showName(userId: string) {

        const users = this.getGameUsers()
        const index = users.findIndex(user => user!.id === userId)
        if(index === -1) return this

        return this.setIn(['gameUsers', index, 'userSeesName'], true) as this
    }

    selectNameLoading(state: boolean) {
        return this.set('fillNameLoading', state) as this
    }

    randomNameLoading(state: boolean) {
        return this.set('randomNameLoading', state) as this
    }

    getGameUsers() {
        return this.get('gameUsers') as List<GameUserEntity>
    }
}