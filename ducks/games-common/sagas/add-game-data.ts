import { call } from 'redux-saga/effects'

import { socketPrefix } from '..'
import { socketEmit } from '../../../code/socket/socket-emit'

export function* addGameDataSaga({ payload }: any) {

    const { gameKey, data } = payload

    if(data && data.length) {
        yield call(socketEmit, `${socketPrefix}/add-game-data`, { gameKey, data })
    }
}