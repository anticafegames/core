import { iGameUserResponce, iGameUser } from "./game-user-entity";

export type iGameState = 'undefined' | 'init' | 'prepare' | 'game'

export interface iReconnectStateResponce {
    gameState: iGameState
    users: iGameUserResponce[]
}

export interface iReconnectState {
    gameState: iGameState
    users: iGameUser[]
}