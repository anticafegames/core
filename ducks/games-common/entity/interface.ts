export type gameKey = 'whoAmI' 

export interface iReconnectGameState {
    gameKey: gameKey
    state: any
}

export interface iGame {
    canStartGame: any
    entity: any
    reducer: any
    bindSagas: any
    bindSocketEvents: any
    unbindSocketEvents: any
    stopGame: any
    reconnectGame?: any
}