/*export const socketUrl = 'https://www.anticafeapi.ru'
export const apiUrl = 'https://www.anticafeapi.ru'*/

export const socketUrl = location.host === "www.anticafegames.ru" ? 'https://www.anticafeapi.ru' : `${location.protocol}//localhost:443`
export const apiUrl = location.host === "www.anticafegames.ru" ? 'https://www.anticafeapi.ru' : `${location.protocol}//localhost:443`