import { CHANGE_OWNER_ID_REQUEST, KICK_FROM_ROOM_REQUEST, OWNER_KNOCK_ON_ROOM_SUCCESS } from '..'

export type ownerActionMode = 'changeOwner' | 'kick'

export function ownerAction(mode: ownerActionMode, data: any) {

    switch (mode) {

        case 'changeOwner':
            return {
                type: CHANGE_OWNER_ID_REQUEST,
                payload: { userId: data.userId }
            }

        case 'kick':
            return {
                type: KICK_FROM_ROOM_REQUEST,
                payload: { userId: data.userId }
            }
    }
}

export function knockOnRoomResponce(userId: string, knockToken: string) {
    return {
        type: OWNER_KNOCK_ON_ROOM_SUCCESS,
        payload: { userId, knockToken }
    }
}