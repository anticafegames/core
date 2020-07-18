
export type loginMode = 'check' | 'login'

//DI
export default class Auth {
    static login: (loginMode: loginMode) => any
    static waitAuthentication: (waitLogIn: boolean, waitLoadUser: boolean) => any
}