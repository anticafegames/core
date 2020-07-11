import { iResult } from "./interfaces"

export const getResult = <T>(error?: string, result?: T): iResult<T> => ({ error, result })

