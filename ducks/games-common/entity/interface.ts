export type gameKey = 'whoAmI' | 'crocodile' | 'alias'
export interface iReconnectGameState {
    gameKey: gameKey
    state: any
}
export interface iGameDuck {
    canStartGame: any
    entity: any
    reducer: any
    bindSagas: any
    bindSocketEvents: any
    unbindSocketEvents: any
    stopGame: any
    reconnectGame?: any
}