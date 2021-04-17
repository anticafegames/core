import { call, put, select } from 'redux-saga/effects'

import { socketEmit, socketEmitAndWaitData } from '../../../../code/socket/socket-emit'
import Toasts from '../../../../code/alerts/toast'
import { ADD_TEAM_LOADING, ADD_TEAM_SUCCESS, LOAD_PACKS_LOADING, LOAD_PACKS_SOCKET_EVENT, LOAD_PACKS_SUCCESS, CHANGE_SETTINGS_SUCCESS, TEAM_LOADING, socketPrefix, DELETE_TEAM_SUCCESS } from '../constants'
import { packsSelector, teamByIdSelector } from '..'
import { iSettingsParams } from '../entity/settings-params-entity'
import { iDeleteTeamResponce } from '../entity/interface'
import { iTeam } from '../entity/team-entity'

export function* prepareStartSaga({ payload }: any) {

    return true
}

export function* changeTeamEmitSaga({ payload }: any) {

    const { userId, from, to, index } = payload
    yield call(socketEmit, `${socketPrefix}/change-team`, { userId, from, to, index })
}

export function* addTeamEmitSaga() {

    yield put({ type: ADD_TEAM_LOADING, payload: { loading: true } })
    yield call(socketEmit, `${socketPrefix}/add-team`, { })
}

export function* addTeamSocketEvent({ payload }: any) {

    const { error, result } = payload

    if(error) {
        Toasts.messageToast(error)
        return yield put({ type: ADD_TEAM_LOADING, payload: { loading: false } })
    }

    yield put({ type: ADD_TEAM_SUCCESS, payload: { team: result } })
}

export function* loadPacksEmitSaga() {

    const packs = yield select(packsSelector)
    if(packs) return

    yield put({ type: LOAD_PACKS_LOADING, payload: { loading: true } })

    const { error, result } = yield socketEmitAndWaitData(`${socketPrefix}/load-packs`, {}, false, LOAD_PACKS_SOCKET_EVENT)

    if(error) {
        Toasts.messageToast(error)
        return
    }

    yield put({ type: LOAD_PACKS_SUCCESS, payload: result })
}

export function* changeSettingsSaga({ payload }: any) {

    const settings: iSettingsParams = payload.settings

    yield put({ 
        type: CHANGE_SETTINGS_SUCCESS,
        payload: { settings }
     })
}

export function* deleteTeamSagaEmit({ payload }: any) {

    const { team } = payload

    yield put({ type: TEAM_LOADING, payload: { teamId: team, loading: true } })
    yield call(socketEmit, `${socketPrefix}/delete-team`, { team })
}

export function* deleteTeamSocketEvent({ payload }: any) {

    const { error, result, teamId } = payload

    if(error) {
        Toasts.messageToast(error)
        return yield put({ type: TEAM_LOADING, payload: { teamId, loading: false } })
    }

    const data: iDeleteTeamResponce = result
    const deletingTeam: iTeam = yield select(teamByIdSelector(data.teamId))

    yield put({
        type: DELETE_TEAM_SUCCESS,
        payload: { teamId: data.teamId, toTeam: data.toTeam, users: deletingTeam.users }
    })
}