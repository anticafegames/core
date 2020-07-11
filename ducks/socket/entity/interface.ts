
export interface iSocketAction {
    socketKey: string
    sagaKey: string
}

export interface iSocketResult {
    socketKey: string
    sagaKey: string
    data: any
}

export interface iSocketResultData {
    error?: any
    result?: any
}