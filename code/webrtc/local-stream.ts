import LocalStorage from '../local-storage'
import { iDeviceSettings } from '../../ducks/webrtc-devices/entity/interface'

export const streamConstraints = (): MediaStreamConstraints => {

    const streamConstraints: iDeviceSettings = LocalStorage.getObjectFromStorage('streamConstraints')

    return {
        "audio": {
            deviceId: { ideal: streamConstraints ? streamConstraints.audioinput : 'default' }
        }, 
        "video": {
            deviceId: { ideal: streamConstraints ? streamConstraints.videoinput : 'default' }
        }
    }
}