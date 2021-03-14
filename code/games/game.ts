import { gameKey, iGameDuck } from '../../ducks/games-common/entity/interface'
import { GameManual } from './game-manual'

export default class Game {

    gameKey!: gameKey
    gameName!: string

    duck!: iGameDuck

    //DI
    _manual!: GameManual
    //DI
    _gameboard?: () => JSX.Element

    get manual() {

        if(!this._manual) {
            throw new Error('Не определен _manual')
        }

        return this._manual
    }

    get gameboard() {

        if(!this._gameboard) {
            throw new Error('Не определен _gameboard')
        }

        return this._gameboard()
    }
} 