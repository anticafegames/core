import Game from '../../code/games/game'
import { gameKey } from '../../ducks/games-common/entity/interface'

import { game as duck } from './ducks'

export class WhoAmIGame extends Game {

    gameKey: gameKey = 'whoAmI'
    gameName: string = 'Заготовка'

    duck = duck
}

export default new WhoAmIGame()