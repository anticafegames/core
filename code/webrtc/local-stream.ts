import LocalStorage from '../local-storage'
import { iDeviceSettings } from '../../ducks/webrtc-devices/entity/interface'

export const streamConstraints = async (): Promise<MediaStreamConstraints> => {

    const streamConstraints: iDeviceSettings = await LocalStorage.getObjectFromStorage('streamConstraints')

    return {
        "audio": {
            deviceId: { ideal: streamConstraints ? streamConstraints.audioinput : 'default' }
        }, 
        "video": {
            deviceId: { ideal: streamConstraints ? streamConstraints.videoinput : 'default' }
        }
    }
}

class LocalStream {

    static createLocalStream: () => Promise<boolean | MediaStream>

}

export default LocalStream