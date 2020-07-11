import { localstorageKey } from '../config/app-config'

export default class LocalStorage {

    static setObjectToStorage(object: any, prefix: string) {
        localStorage.setItem(`${localstorageKey}-${prefix}`, JSON.stringify(object))
    }

    static getObjectFromStorage(prefix: string) {
        const object = localStorage.getItem(`${localstorageKey}-${prefix}`)
        return object && JSON.parse(object)
    }

    static clearStorage(prefix: string) {
        localStorage.removeItem(`${localstorageKey}-${prefix}`)
    }
}