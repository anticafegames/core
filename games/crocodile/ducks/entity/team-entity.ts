import { List, Record } from 'immutable'

import GameUserEntity, { iGameUser } from './game-user-entity'

export interface iTeam {
    name: string,
    users: (GameUserEntity | iGameUser)[]

    teamloading: boolean
}

const defaultParams: iTeam = {
    name: '',
    users: [],

    teamloading: false
}

export default class TeamEntity extends Record(defaultParams) {

    constructor(params: iTeam) {
        params!.users = params!.users.map((user: any) => (user instanceof GameUserEntity) ? user : new GameUserEntity(user))
        super(params)
    }

    addUsers(users: GameUserEntity[]) {
        return this.updateIn(['users'], list => list.merge(list.push(...users))) as this
    }

    addUser(user: GameUserEntity) {
        return this.updateIn(['users'], list => list.merge(list.push(user))) as this
    }

    addUserToIndex(user: GameUserEntity, index: number) {
        return this.updateIn(['users'], list => list.merge(list.splice(index, 0, user))) as this
    }

    deleteUser(userId: string) {

        const index = this.userIndexById(userId)
        if(index < 0) return this

        return this.deleteIn(['users', index]) as this
    }

    teamLoading(loading: boolean) {
        return this.set('teamloading', loading) as this
    }

    userById(userId: string) {
        return this.users.find(user => user!.id === userId)
    }
    
    userIndexById(userId: string) {
        return this.users.findIndex(user => user!.id === userId)
    }

    get users() {
        return this.get('users') as List<GameUserEntity>
    }

    get id() {
        return this.get('name') as string
    }
}