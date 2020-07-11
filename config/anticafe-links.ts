import { vkMiniAppLink } from './vk-config'

export const origin = location.origin

export const invaitRoomLink = (roomId: string) => `${origin}#roomid=${roomId}`
export const invaitRoomLinkVKApp = (roomId: string) => `${vkMiniAppLink}#roomid=${roomId}`