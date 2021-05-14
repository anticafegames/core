import { put, call, select, take, race, delay } from "redux-saga/effects"

import { CREATE_LOCAL_STREAM_SUCCESS, localStreamSelector, CLOSE_LOCAL_STREAM_SUCCESS } from ".."

import { iResultRequest } from "../../../interfaces"
import { infoMessage, errorMessage } from "../../../code/messages"
import { errorSagaKey, waitSuccess } from "../../../code/ducks/saga-helper"
import LocalStream from '../../../code/webrtc/local-stream'


const createLocalStream = async () => {

    const promise = new Promise(async (resolve, reject) => {

        try {            

            const stream = await LocalStream.createLocalStream()
            resolve({ result: { stream } })
        }
        catch (error) {
            
            errorMessage(error)
            resolve({error: 'Ошибка getUserMedia'})
        } 
    })

    return promise
}

export default function* createLocalStreamSaga(): any {

    const { streamResult, delayResult } = yield race({
        streamResult: call(createLocalStream),
        delayResult: delay(30000)
    })
    
    const error = delayResult || streamResult.error

    if (!error) {

        const stream = streamResult.result.stream

        yield put({
            type: CREATE_LOCAL_STREAM_SUCCESS,
            payload: { stream }
        })

    } else {

        errorMessage(error)

        yield put({
            type: errorSagaKey(CREATE_LOCAL_STREAM_SUCCESS),
            payload: { error }
        })
    }
    
    return yield !error
}

export function* closeLocalStream() {

    const stream: MediaStream = yield select(localStreamSelector)
    
    if(!stream) {
        return
    }
    
    stream.getTracks().forEach(track => track.stop())

    yield put({type: CLOSE_LOCAL_STREAM_SUCCESS})
}

export function* waitLocalStream(): any {
    
    const localStream = yield select(localStreamSelector)

    if (!localStream) {
        const { error } = yield call(waitSuccess, CREATE_LOCAL_STREAM_SUCCESS)
        return !error
    }

    return true
}