import Game from '../../code/games/game'
import { gameKey } from '../../ducks/games-common/entity/interface'

import { game as duck } from '../who-am-i/ducks'

export class AliasGame extends Game {

    gameKey: gameKey = 'alias'
    gameName: string = 'Скажи иначе'

    duck = duck
}

export default new AliasGame()