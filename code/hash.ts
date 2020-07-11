import passportHash from 'password-hash'
import { v1 as uuidv1 } from 'uuid'

export const hash = (value: string) => passportHash.generate(value)
export const guid = () => uuidv1()
