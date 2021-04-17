import { gamePrefix } from '../../../config/app-config'

export const moduleName = 'crocodile'
export const gameName = 'Крокодил'

export const socketPrefix = `game/${moduleName}`
const prefix = `${gamePrefix}/${moduleName}`


export const PREPARE_GAME_START_SOCKET_EVENT = `${prefix}/PREPARE_GAME_START_SOCKET_EVENT`
export const PREPARE_GAME_START_SUCCESS = `${prefix}/PREPARE_GAME_START_SUCCESS`

export const STOP_GAME_SUCCESS = `${prefix}/STOP_GAME_SUCCESS`
export const RECONNECT_GAME_SUCCESS = `${prefix}/RECONNECT_GAME_SUCCESS`

export const START_GAME_REQUEST = `${prefix}/START_GAME_REQUEST`
export const START_GAME_SOCKET_EVENT = `${prefix}/START_GAME_SOCKET_EVENT`
export const START_GAME_SUCCESS = `${prefix}/START_GAME_SUCCESS`

//Prepare 

export const CHANGE_TEAM_REQUEST = `${prefix}/CHANGE_TEAM_REQUEST`
export const CHANGE_TEAM_SOCKET_EVENT = `${prefix}/CHANGE_TEAM_SOCKET_EVENT`
export const CHANGE_TEAM_SUCCESS = `${prefix}/CHANGE_TEAM_SUCCESS`

export const ADD_TEAM_REQUEST = `${prefix}/ADD_TEAM_REQUEST`
export const ADD_TEAM_SOCKET_EVENT = `${prefix}/ADD_TEAM_SOCKET_EVENT`
export const ADD_TEAM_SUCCESS = `${prefix}/ADD_TEAM_SUCCESS`
export const ADD_TEAM_LOADING = `${prefix}/ADD_TEAM_LOADING`

export const LOAD_PACKS_REQUEST = `${prefix}/LOAD_PACKS_REQUEST`
export const LOAD_PACKS_SOCKET_EVENT = `${prefix}/LOAD_PACKS_SOCKET_EVENT`
export const LOAD_PACKS_SUCCESS = `${prefix}/LOAD_PACKS_SUCCESS`
export const LOAD_PACKS_LOADING = `${prefix}/LOAD_PACKS_LOADING`

export const CHANGE_SETTINGS_REQUEST = `${prefix}/CHANGE_SETTINGS_REQUEST`
export const CHANGE_SETTINGS_SUCCESS = `${prefix}/CHANGE_SETTINGS_SUCCESS`

export const DELETE_TEAM_REQUEST = `${prefix}/DELETE_TEAM_REQUEST`
export const DELETE_TEAM_SOCKET_EVENT = `${prefix}/DELETE_TEAM_SOCKET_EVENT`
export const DELETE_TEAM_SUCCESS = `${prefix}/DELETE_TEAM_SUCCESS`

export const TEAM_LOADING = `${prefix}/TEAM_LOADING`

//Game

export const START_ROUND_REQUEST = `${prefix}/START_ROUND_REQUEST`
export const START_ROUND_SOCKET_EVENT = `${prefix}/START_ROUND_SOCKET_EVENT`
export const START_ROUND_SUCCESS = `${prefix}/START_ROUND_SUCCESS`

export const CHANGE_TIMER = `${prefix}/CHANGE_TIMER`
 



