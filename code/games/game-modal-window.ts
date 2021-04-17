export default class GameModalWindows {

    _windows: Map<string, () => any> = new Map([])

    registerModal = <T>(name: T, actionCreater: () => any) => {
        this._windows.set(name as any, actionCreater)
    }

    showModal = <T>(name: T) => {
        return this._windows.get(name as any)!()
    }
}