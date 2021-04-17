import { call, put, select, delay } from 'redux-saga/effects'
import { timerSelector } from '..'

import { socketEmit, socketEmitAndWaitData } from '../../../../code/socket/socket-emit'
import { CHANGE_TIMER, socketPrefix, START_ROUND_SUCCESS } from '../constants'

export function* startRoundEmitSaga() {
    yield call(socketEmit, `${socketPrefix}/start-round`, { })
}

export function* startRoundSocketEvent() {

    yield put({
        type: START_ROUND_SUCCESS
    })

    let timer: number = yield select(timerSelector)

    while (timer >= 0) {

        yield put({ type: CHANGE_TIMER, payload: { timer } })
        yield delay(1000)
        timer--
    }

    yield yield put({ type: CHANGE_TIMER, payload: { timer: 60 } })

}