import { List, Record } from 'immutable'

export type iTimerState = 'stopped' | 'process'

export interface iTimer {
    timer: number
    timerState: iTimerState
}

const defaultParams: iTimer = {
    timer: 60,
    timerState: 'stopped'
}

export default class TimerEntity extends Record(defaultParams) {

    constructor(params?: iTimer) {
        params ? super(params) : super()
    }
}