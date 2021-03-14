import Game from '../../code/games/game'
import { gameKey } from '../../ducks/games-common/entity/interface'

import { game as duck } from './ducks'

export class CrocodileGame extends Game {

    gameKey: gameKey = 'crocodile'
    gameName: string = 'Крокодил'

    duck = duck
}

export default new CrocodileGame()