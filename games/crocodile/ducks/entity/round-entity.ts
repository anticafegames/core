import { List, Record } from 'immutable'
import { iHostTeamResponce, iHostUserData } from './interface'

export type iRoundState = 'wait' | 'stopped' | 'process'

export interface iRound {

    roundState: iRoundState
    
    timer: number

    hostTeam?: string
    hostUserId?: string

    hostUserData?: iHostUserData
}

const defaultParams: iRound = {
    timer: 60,
    roundState: 'wait',

    hostTeam: undefined,
    hostUserId: undefined,
    
    hostUserData: undefined
}

export default class RoundEntity extends Record(defaultParams) {

    constructor(params?: iRound) {
        params ? super(params) : super()
    }

    setTimer(timer: number) {
        return this.set('timer', timer) as this
    }

    setHostTeam(hostTeam: iHostTeamResponce) {
        return this
            .set('hostTeam', hostTeam.teamId)
            .set('hostUserId', hostTeam.hostUserId) as this
    } 

    setHostUserData(hostUserData: iHostUserData) {
        return this
            .set('hostUserData', hostUserData) as this
    }

    setRoundData(data: any) {

        let entity = this.setHostTeam(data.hostTeam)

        if(data.hostUserData) {
            entity = entity.setHostUserData(data.hostUserData)
        }

        return entity
    }
}