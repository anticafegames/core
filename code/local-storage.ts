//DI
export default class LocalStorage {
    static setObjectToStorage: (object: any, prefix: string) => Promise<any> 
    static getObjectFromStorage: (prefix: string) => Promise<any> 
    static clearStorage: (prefix: string) => Promise<any> 
}