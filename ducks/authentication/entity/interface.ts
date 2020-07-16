import { iSession } from "./auth-session-entity";

export type iAuthVkStatus = 'connected' | 'not_authorized' | 'unknown '
export type iAppKey = 'web' | 'vk-app' | 'vk-game' | 'mobile'

export interface iAuthVkResponse {
    status: iAuthVkStatus
    session: iSession
}