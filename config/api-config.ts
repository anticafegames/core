/*export const socketUrl = 'https://www.anticafeapi.ru'
export const apiUrl = 'https://www.anticafeapi.ru'*/

export const socketUrl = global || window.location.host === "www.anticafegames.ru" ? 'https://www.anticafeapi.ru' : `${window.location.protocol}//localhost:443`
export const apiUrl = global || window.location.host === "www.anticafegames.ru" ? 'https://www.anticafeapi.ru' : `${window.location.protocol}//localhost:443`