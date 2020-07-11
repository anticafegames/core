//для веба
export const vkAppId = 7358775
//для vk app mini
export const vkMiniAppKey = 7514284
//для каталога игр
export const vkGameAppKey = 7514257

export const vkApiVersion = '5.73'

export const defaultPhoto = 'https://sun9-67.userapi.com/c851136/v851136209/1687e/niVWy1PCZ8k.jpg?ava=1'

export const state = 'anticafe'
export const vkAuthUrl = `https://oauth.vk.com/authorize?client_id=${vkAppId}&display=popup&redirect_uri=${location.protocol}//${location.host}/auth&scope=offline,photos&response_type=token&v=${vkApiVersion}&state=anticafe`
export const vkAuthPopupParams = 'width=675px,height=430'

export const regexVkHash = /^#access_token=.+&expires_in=\d+&user_id=\d+&state=anticafe$/

export const vkApiUrl = 'https://api.vk.com/'
export const vkMiniAppLink = 'https://vk.com/app7514284_222834864'

export const vkUserLink = (userId: number) => `https://vk.com/id${userId}`
export const vkShareLink = (url: string, title: string) => `https://vkontakte.ru/share.php?url=${encodeURIComponent(url)}&title=${title}`

export const yandexSearchLink = (search: string) => `https://yandex.ru/search/?text=${search}`

