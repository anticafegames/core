import { appName } from '../../config/app-config'
import { createSelector } from 'reselect'
import { Record, OrderedMap, List } from 'immutable'
import { call, put, takeEvery, all, select, take } from 'redux-saga/effects'

import { bindSocketEvents } from '../../code/socket/bind-socket-events-helper'
import { iSocketResult, iSocketAction } from '../socket/entity/interface'
import { todo, errorMessage } from '../../code/messages'
import { ROOM_CONNECT_REQUEST } from '../webrtc-room'
import { localStreamSelector, UPDATE_PROPS, peersSelector } from '../webrtc'
import { iPeersConnection } from '../webrtc/entity/peer-connection-entity'
import MainEntity from './entity/main-entity'
import Toasts from '../../code/alerts/toast'
import LocalStorage from '../../code/local-storage'
import { iDeviceSettings } from './entity/interface'
import { streamConstraints } from '../../code/webrtc/local-stream'
import { changeTracks } from '../webrtc/sagas/track'


/*
*   Contstants 
*/

export const moduleName = 'webrtc-devices'

const prefix = `${appName}/${moduleName}`

export const LOAD_SETTINGS_REQUEST = `${prefix}/LOAD_SETTINGS_REQUEST`
export const LOAD_SETTINGS_SUCCESS = `${prefix}/LOAD_SETTINGS_SUCCESS`

export const CLEAR_SETTINGS_REQUEST = `${prefix}/CLEAR_SETTINGS_REQUEST`
export const CLEAR_SETTINGS_SUCCESS = `${prefix}/CLEAR_SETTINGS_SUCCESS`

export const CHANGE_DEVICES_REQUEST = `${prefix}/CHANGE_DEVICES_REQUEST`
export const CHANGE_DEVICES_SUCCESS = `${prefix}/CHANGE_DEVICES_SUCCESS`

export const MIC_DEVICE_ACTION = `${prefix}/MIC_DEVICE_ACTION`
export const VOLUME_DEVICE_ACTION = `${prefix}/VOLUME_DEVICE_ACTION`

/*
*   Reducer
*/

export default function reducer(state = new MainEntity(), action: any) {
    const { type, payload } = action

    switch (type) {

        case LOAD_SETTINGS_SUCCESS:
            return state
                .loadDevices(payload)

        case CLEAR_SETTINGS_SUCCESS:
            return state
                .clearDevices()

        default:
            return state

    }
}

/*
*   Selectors
*/

export const stateSelector = (state: any) => state[moduleName]

export const audioInputDevicesSelector = createSelector(stateSelector, (state: MainEntity) => state.audioInputDevices)
export const selectedAudioInputDeviceIdSelector = createSelector(stateSelector, (state: MainEntity) => state.selectedAudioInputDeviceId)

export const videoInputDevicesSelector = createSelector(stateSelector, (state: MainEntity) => state.videoInputDevices)
export const selectedVideoInputDeviceIdSelector = createSelector(stateSelector, (state: MainEntity) => state.selectedVideoInputDeviceId)

export const streamSelector = createSelector(stateSelector, (state: MainEntity) => state.stream)

export const loadedSelector = createSelector(stateSelector, (state: MainEntity) => state.loaded)

/*
*   Action Creaters
*/

export type deviceSettingsMode = 'mic-off' | 'volume-off'
export function deviceSettingsAction(mode: deviceSettingsMode, data: any) {

    switch (mode) {

        case 'mic-off':
            return {
                type: MIC_DEVICE_ACTION,
                payload: data
            }

        case 'volume-off':
            return {
                type: VOLUME_DEVICE_ACTION,
                payload: data
            }

    }
}

export function loadSettings() {
    return { type: LOAD_SETTINGS_REQUEST }
}

export function saveChangesAndClear() {
    return { type: CLEAR_SETTINGS_REQUEST }
}

export function changeDevices(kind: MediaDeviceKind, id: string) {
    return {
        type: CHANGE_DEVICES_REQUEST,
        payload: { kind, id }
    }
}

/*
*   Sagas
*/

export function* micOffSettingsActionSaga({ payload }: any) {

    const { off } = payload
    const stream: MediaStream = yield select(localStreamSelector)

    const [audioTrack] = stream.getAudioTracks()

    if (audioTrack.enabled === !off) {
        return
    }

    audioTrack.enabled = !off

    yield put({
        type: UPDATE_PROPS
    })
}

export function* volumeOffSettingsActionSaga({ payload }: any) {

    const { off, userId } = payload
    const peers: iPeersConnection[] = yield select(peersSelector)

    const peer = peers.find(item => item.userId === userId)

    if (!peer) {
        return
    }

    const track = peer.track

    if (!track) {
        return
    }

    const [audioTrack] = track.getAudioTracks()

    if (!audioTrack) {
        return
    }

    audioTrack.enabled = !off

    yield put({
        type: UPDATE_PROPS
    })
}

export function* loadSettingsSaga(): any {

    try {

        const localStream: MediaStream = yield select(localStreamSelector)
        
        if(localStream) {
            localStream.getTracks().forEach(track => track.stop())
        }

        const devices: MediaDeviceInfo[] = yield navigator.mediaDevices.enumerateDevices()

        const audioInputDevices = devices.filter(device => device.kind === 'audioinput')
        const videoInputDevices = devices.filter(device => device.kind === 'videoinput')

        const deviceSettings = (yield call(LocalStorage.getObjectFromStorage, 'streamConstraints')) || {}

        const selectedAudioInputDeviceId = deviceSettings.audioinput || ''
        const selectedVideoInputDeviceId = deviceSettings.videoinput || ''
        
        const stream: MediaStream = yield navigator.mediaDevices.getUserMedia(yield call(streamConstraints))

        yield put({
            type: LOAD_SETTINGS_SUCCESS,
            payload: { audioInputDevices, videoInputDevices, selectedAudioInputDeviceId, selectedVideoInputDeviceId, stream }
        })
    }
    catch (error) {
        errorMessage(error)
        Toasts.messageToast('Неудалось получить доступ к устройствам')
    }
}

export function* saveChangesAndClearSaga() {

    const localStream: MediaStream = yield select(localStreamSelector)
    const stream: MediaStream = yield select(streamSelector)
    
    if(localStream) {
       yield changeTracks(stream)
    } else {
        stream.getTracks().forEach(track => track.stop())
    }

    yield put({
        type: CLEAR_SETTINGS_SUCCESS
    })
}

export function* changeDevicesSaga({ payload }: any): any {

    try {
        const kind: MediaDeviceKind = payload.kind
        const id: string = payload.id

        const stream: MediaStream = yield select(streamSelector)

        const trackGetterKey = kind === 'audioinput' ? 'getAudioTracks' : 'getVideoTracks'
        const deviceKey = kind === 'audioinput' ? 'audio' : 'video'

        const [oldTrack] = stream[trackGetterKey]()

        if(oldTrack.id === id) return

        const deviceSettings = {
            [deviceKey]: {
                deviceId: {
                    ideal: id
                }
            }
        }

        oldTrack.stop()
        stream.removeTrack(oldTrack)

        const newStream = yield navigator.mediaDevices.getUserMedia(deviceSettings)
        const [newTrack] = newStream[trackGetterKey]()
        stream.addTrack(newTrack)

        let newDeviceSettings = yield call(LocalStorage.getObjectFromStorage, 'streamConstraints')

        if(!newDeviceSettings) {
            newDeviceSettings = { [kind]: id }
        } else {
            newDeviceSettings[kind] = id
        }

        LocalStorage.setObjectToStorage(newDeviceSettings, 'streamConstraints')
    } catch (error) {
        errorMessage(error)
    }
}

export function* saga() {
    yield all([
        takeEvery(MIC_DEVICE_ACTION, micOffSettingsActionSaga),
        takeEvery(VOLUME_DEVICE_ACTION, volumeOffSettingsActionSaga),
        takeEvery(LOAD_SETTINGS_REQUEST, loadSettingsSaga),
        takeEvery(CLEAR_SETTINGS_REQUEST, saveChangesAndClearSaga),
        takeEvery(CHANGE_DEVICES_REQUEST, changeDevicesSaga)
    ])
}