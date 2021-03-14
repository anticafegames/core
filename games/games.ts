
import Game from '../code/games/game'
import { gameKey } from '../ducks/games-common/entity/interface'

import whoAmIGame from './who-am-i'
import crocodileGame from './crocodile'
import aliasGame from './alias'

export default class Games {

    static gameList: Map<gameKey, Game> = new Map([
        ['whoAmI', whoAmIGame],
        ['crocodile', crocodileGame],
        ['alias', aliasGame]
    ])

    static getGame(gameKey: gameKey) {
        return Games.gameList.get(gameKey)
    }

    static get games() {
        return [...Games.gameList.values()]
    }
}