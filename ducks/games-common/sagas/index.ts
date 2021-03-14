import { gameKey, iGameDuck } from '../entity/interface'
import Games from '../../../games/games'

export const getGame = (gameKey: gameKey): iGameDuck => {

    const game = Games.getGame(gameKey)

    if(!game) {
        throw new Error(`Неизвестная игра: ${gameKey}`)
    }

    return game.duck
} 