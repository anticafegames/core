import { gameKey, iGameDuck } from '../../ducks/games-common/entity/interface'
import { GameManual } from './game-manual'
import GameModalWindows from './game-modal-window'

export default class Game {

    gameKey!: gameKey
    gameName!: string

    duck!: iGameDuck
    modalWindows: GameModalWindows = new GameModalWindows()
    
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