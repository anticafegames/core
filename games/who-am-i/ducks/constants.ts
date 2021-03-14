import { gamePrefix } from '../../../config/app-config'

export const moduleName = 'who-am-i'
export const gameName = 'Кто Я?'

export const socketPrefix = `game/${moduleName}`
const prefix = `${gamePrefix}/${moduleName}`

export const PREPARE_GAME_START_SOCKET_EVENT = `${prefix}/PREPARE_GAME_START_SOCKET_EVENT`
export const PREPARE_GAME_START_SUCCESS = `${prefix}/PREPARE_GAME_START_SUCCESS`

export const STOP_GAME_SUCCESS = `${prefix}/STOP_GAME_SUCCESS`
export const RECONNECT_GAME_SUCCESS = `${prefix}/RECONNECT_GAME_SUCCESS`

export const SELECT_NAME_REQUEST = `${prefix}/SELECT_NAME_REQUEST`
export const SELECT_NAME_SOCKET_EVENT = `${prefix}/SELECT_NAME_SOCKET_EVENT`
export const SELECT_NAME_SUCCESS = `${prefix}/SELECT_NAME_SUCCESS`
export const SELECT_MY_NAME_SUCCESS = `${prefix}/SELECT_MY_NAME_SUCCESS`

export const SELECT_NAME_LOADING = `${prefix}/SELECT_NAME_LOADING`

export const START_GAME_REQUEST = `${prefix}/START_GAME_REQUEST`
export const START_GAME_SOCKET_EVENT = `${prefix}/START_GAME_SOCKET_EVENT`
export const START_GAME_SUCCESS = `${prefix}/START_GAME_SUCCESS`

export const SHOW_NAME_REQUEST = `${prefix}/SHOW_NAME_REQUEST`
export const SHOW_NAME_SOCKET_EVENT = `${prefix}/SHOW_NAME_SOCKET_EVENT`
export const SHOW_NAME_SUCCESS = `${prefix}/SHOW_NAME_SUCCESS`
export const SHOW_MY_NAME_SUCCESS = `${prefix}/SHOW_MY_NAME_SUCCESS`

export const RANDOM_NAME_REQUEST = `${prefix}/RANDOM_NAME_REQUEST`
export const RANDOM_NAME_SOCKET_EVENT = `${prefix}/RANDOM_NAME_SOCKET_EVENT`
export const RANDOM_NAME_SUCCESS = `${prefix}/RANDOM_NAME_SUCCESS`
export const RANDOM_NAME_LOADING = `${prefix}/RANDOM_NAME_LOADING`