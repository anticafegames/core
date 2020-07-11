import { iShortRoom, iShortRoomResponse } from './rooms-entity'


export const isEqualRoom = (oldRoom: iShortRoom, candidate: iShortRoomResponse) => JSON.stringify({ ...oldRoom, owner: null }) === JSON.stringify({ ...candidate, owner: null })