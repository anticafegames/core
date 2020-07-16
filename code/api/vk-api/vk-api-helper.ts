
export type loginMode = 'check' | 'login'

//DI
export default class Auth {
    static login: (loginMode: loginMode) => Generator
    static waitAuthentication: (waitLogIn: boolean, waitLoadUser: boolean) => any
}