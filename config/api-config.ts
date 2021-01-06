//export const socketUrl = 'https://www.anticafeapi.ru'
//export const apiUrl = 'https://www.anticafeapi.ru'

declare var window: any

export const socketUrl = window.isNative || window.location.host === "www.anticafegames.ru" ? 'https://www.anticafeapi.ru' : `${window.location.protocol}//localhost:443`
export const apiUrl = window.isNative || window.location.host === "www.anticafegames.ru" ? 'https://www.anticafeapi.ru' : `${window.location.protocol}//localhost:443`