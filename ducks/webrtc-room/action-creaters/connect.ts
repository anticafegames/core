import { iJoinRoomParams, iRoomJoinMode } from "../entity/interface"
import { ROOM_CONNECT_REQUEST, LEAVE_FROM_ROOM_REQUEST, KNOCK_ON_ROOM_REQUEST } from ".."
import { iCreateFormResult } from "../entity/room-reg-params-entity"

export function connectToRoom(params: Partial<iJoinRoomParams>) {

    const mode: iRoomJoinMode = 'join'

    return {
        type: ROOM_CONNECT_REQUEST,
        payload: {
            mode,
            params
        }
    }
}

export function createRoom(params: iCreateFormResult) {

    const mode: iRoomJoinMode = 'create'

    return {
        type: ROOM_CONNECT_REQUEST,
        payload: {
            mode,
            params
        }
    }
}

export function knockOnRoom(roomId: string) {
    return {
        type: KNOCK_ON_ROOM_REQUEST,
        payload: { roomId }
    }
}

export function leaveFromRoom() {
    return {
        type: LEAVE_FROM_ROOM_REQUEST
    }
}