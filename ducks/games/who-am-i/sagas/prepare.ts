import { select, call, put } from 'redux-saga/effects'

import { PREPARE_GAME_START_SUCCESS, socketPrefix, SELECT_NAME_LOADING, SELECT_MY_NAME_SUCCESS, SELECT_NAME_SUCCESS } from '../constants'
import { iGameUserResponce, iGameUser } from '../entity/game-user-entity'
import { convertResponceGameUser } from '../entity/converter'
import { replace } from 'connected-react-router'
import { CHANGE_ROOM_STATUS } from '../../../webrtc-room'
import showBoard from '../../../../code/games/who-am-i/show-modal-select-name'
import { socketEmit } from '../../../../code/socket/socket-emit'
import { messageToast } from '../../../../code/alerts/toast'

export function* prepareStartSaga({ payload }: any) {

    const gameUsersResponce: iGameUserResponce[] = payload.users
    const gameUsers: iGameUser[] = yield call(convertResponceGameUser, gameUsersResponce)

    yield put({
        type: CHANGE_ROOM_STATUS,
        payload: { status: 'game' }
    })

    yield put({
        type: PREPARE_GAME_START_SUCCESS,
        payload: { gameUsers }
    })

    yield put(showBoard())
}

export function* selectNameEmitSaga({ payload }: any) {
    const { name } = payload

    if(!name.trim()) {
        return messageToast('Имя не должно быть пустым');
    }

    yield put({ type: SELECT_NAME_LOADING, payload: { loading: true } })
    yield call(socketEmit, `${socketPrefix}/select-name`, { name })
}

export function* selectNameSocketEventSaga({ payload }: any) {

    const { error, userId, name, nameFilled } = payload

    if(error) {
        return messageToast(error);
    }

    if(nameFilled) {
        return yield put({ type: SELECT_MY_NAME_SUCCESS })
    }

    yield put({
        type: SELECT_NAME_SUCCESS,
        payload: { userId, name }
    })
}