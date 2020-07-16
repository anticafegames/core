import { localstorageKey } from '../config/app-config'

export default class LocalStorage {

    static setObjectToStorage: (object: any, prefix: string) => Promise<any> = async (object: any, prefix: string) => {
        await localStorage.setItem(`${localstorageKey}-${prefix}`, JSON.stringify(object))
        return true
    }

    static getObjectFromStorage: (prefix: string) => Promise<any> = async (prefix: string) => {
        const object = localStorage.getItem(`${localstorageKey}-${prefix}`)
        return await (object && JSON.parse(object))
    }

    static clearStorage: (prefix: string) => Promise<any> = async (prefix: string) => {
        await localStorage.removeItem(`${localstorageKey}-${prefix}`)
        return true
    }
}