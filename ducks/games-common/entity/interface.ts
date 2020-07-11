export type gameKey = 'whoAmI' 

export interface iReconnectGameState {
    gameKey: gameKey
    state: any
}

export interface iGame {
    canStartGame: any
    bindSocketEvents: any
    unbindSocketEvents: any
    stopGame: any
    reconnectGame?: any
}