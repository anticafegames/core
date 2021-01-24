import { gameKey, iGame } from '../entity/interface'
import games from '../../../games/who-am-i/games'

export const getGame = (gameKey: gameKey): iGame => {

    const game = games[gameKey]

    if(!game) {
        throw new Error(`Неизвестная игра: ${gameKey}`)
    }

    return game
} 