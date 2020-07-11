import { List, Record } from 'immutable'

export interface iMainEntity {
    stream?: MediaStream,
    audioInputDevices?: MediaDeviceInfo[],
    selectedAudioInputDeviceId: string,
    videoInputDevices?: MediaDeviceInfo[],
    selectedVideoInputDeviceId: string,
    loaded: boolean
} 

export const defaultParams: iMainEntity = {
    stream: undefined,
    audioInputDevices: undefined,
    selectedAudioInputDeviceId: '',
    videoInputDevices: undefined,
    selectedVideoInputDeviceId: '',
    loaded: false,
}

export default class MainEntity extends Record(defaultParams) {

    constructor(params?: iMainEntity) {
        params ? super(params) : super()
    }

    loadDevices(devices: any) {
        return this
            .set('audioInputDevices', devices.audioInputDevices)
            .set('selectedAudioInputDeviceId', devices.selectedAudioInputDeviceId)
            .set('videoInputDevices', devices.videoInputDevices)
            .set('selectedVideoInputDeviceId', devices.selectedVideoInputDeviceId)
            .set('stream', devices.stream)
            .set('loaded', true) as this
    }

    clearDevices() {
        return this
            .set('audioInputDevices', undefined)
            .set('selectedAudioInputDeviceId', '')
            .set('videoInputDevices', undefined)
            .set('selectedVideoInputDeviceId', '')
            .set('stream', undefined)
            .set('loaded', false) as this
    }

    changeStream(stream: MediaStream) {
        return this.set('stream', stream) as this
    }

    get audioInputDevices() {
        return this.get('audioInputDevices') as MediaDeviceInfo[]
    }

    get selectedAudioInputDeviceId() {
        return this.get('selectedAudioInputDeviceId') as string
    }

    get videoInputDevices() {
        return this.get('videoInputDevices') as MediaDeviceInfo[]
    }

    get selectedVideoInputDeviceId() {
        return this.get('selectedVideoInputDeviceId') as string
    }

    get stream() {
        return this.get('stream') as MediaStream
    }

    get loaded() {
        return this.get('loaded') as boolean
    }
}