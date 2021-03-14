import { gamePrefix } from '../../../config/app-config'

export const moduleName = 'who-am-i'
export const gameName = 'Заготовка'

export const socketPrefix = `game/${moduleName}`
const prefix = `${gamePrefix}/${moduleName}`


export const PREPARE_GAME_START_SOCKET_EVENT = `${prefix}/PREPARE_GAME_START_SOCKET_EVENT`
export const PREPARE_GAME_START_SUCCESS = `${prefix}/PREPARE_GAME_START_SUCCESS`

export const STOP_GAME_SUCCESS = `${prefix}/STOP_GAME_SUCCESS`
export const RECONNECT_GAME_SUCCESS = `${prefix}/RECONNECT_GAME_SUCCESS`

export const START_GAME_REQUEST = `${prefix}/START_GAME_REQUEST`
export const START_GAME_SOCKET_EVENT = `${prefix}/START_GAME_SOCKET_EVENT`
export const START_GAME_SUCCESS = `${prefix}/START_GAME_SUCCESS`