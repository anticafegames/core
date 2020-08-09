import { iActionCreatersResult } from "../ducks/interfaces"
import { iShortRoom } from "../../ducks/webrtc-rooms/entity/rooms-entity"

//DI
export default class Modals {
    static showCheckReadyModal: () => iActionCreatersResult
    static showRedirectToBrouserModal: () => iActionCreatersResult
    static showRoomJoinFormPageModal: (room: iShortRoom) => iActionCreatersResult
}