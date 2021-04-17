import { List, Record } from 'immutable'

export type iRoundState = 'wait' | 'stopped' | 'process'

export interface iRound {
    timer: number
    roundState: iRoundState
}

const defaultParams: iRound = {
    timer: 60,
    roundState: 'wait'
}

export default class RoundEntity extends Record(defaultParams) {

    constructor(params?: iRound) {
        params ? super(params) : super()
    }

    setTimer(timer: number) {
        return this.set('timer', timer) as this
    }
}