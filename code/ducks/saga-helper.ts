import { eventChannel } from "redux-saga"
import { take, fork, race, put, call } from "redux-saga/effects"
import { infoMessage } from "../messages"


export function* waitCallback(subscribe: (emit: any) => void): any {
    return yield new Promise((resolve: any) => subscribe(resolve))
}

export function* listenEvent(subcribe: (emit: any) => () => void, eventSagaKey: string, unbindSagaKey: string): any {
    infoMessage(`Привязались к событию ${unbindSagaKey}`)
    const channel = yield eventChannel(subcribe)
    yield fork(listenChannel, channel, eventSagaKey, unbindSagaKey)
}

function* listenChannel(channel: any, eventSagaKey: string, unbindSagaKey: string) {

    while (true) {

        const { channelResult, unbindEvent } = yield race({
            channelResult: take(channel),
            unbindEvent: take(unbindSagaKey)
        })

        if (!unbindEvent) {

            const result = channelResult
            yield put({ type: eventSagaKey, payload: { result } })

        } else {

            infoMessage(`Отвязались от сокет события ${unbindSagaKey}`)
            yield call(channel.close)

            return
        }
    }
}

export const errorSagaKey = (sagaKey: string) => `${sagaKey}/ERROR`
export const waitSuccess = function* (sagaKey: string): any {

    const result = yield race({
        success: take(sagaKey),
        error: take(errorSagaKey(sagaKey))
    })

    return result
}