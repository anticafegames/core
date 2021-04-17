import { List, Record } from 'immutable'
import { createDebuggerStatement } from 'typescript'
import { iGameState } from './interface'
import TeamEntity, { iTeam } from './team-entity'
import SettingsEntity from './settings-entity'
import { iSettingsParams } from './settings-params-entity'
import RoundEntity, { iRound } from './round-entity'

export interface iMainEntity {
    state: iGameState

    teams: List<TeamEntity>
    settings: SettingsEntity

    round: RoundEntity

    addTeamloading: boolean
}

const defaultParams: iMainEntity = {
    state: 'prepare',
    teams: List([]),
    settings: new SettingsEntity(),

    round: new RoundEntity(),

    addTeamloading: false
}

export default class MainEntity extends Record(defaultParams) {

    constructor(params?: iMainEntity) {
        params ? super(params) : super()
    }

    reconnectGame(state: iGameState, settings: iSettingsParams, teams: iTeam[]) {

        return this
            .updateSettings(entity => entity.setParams(settings))
            .set('state', state)
            .set('teams', List(teams.map(team => new TeamEntity(team)))) as this
    }

    changeTeam(userId: string, from: string, to: string, index: number) {

        return this.updateIn(['teams'], (teams: List<TeamEntity>) => {
            
            const fromIndex = this.indexTeamById(from)
            const toIndex = this.indexTeamById(to)
            if(fromIndex < 0 || toIndex < 0) return teams

            const user = this.teamById(from).userById(userId)

            let newTeams = teams.updateIn([fromIndex], (team: TeamEntity) => team.deleteUser(userId))
            newTeams = newTeams.updateIn([toIndex], (team: TeamEntity) => team.addUserToIndex(user, index))

            return teams.merge(newTeams)

        }) as this
    }

    addTeam(team: iTeam) {
        return this
            .updateIn(['teams'], (teams: List<TeamEntity>) => teams.merge(teams.push(new TeamEntity(team))))
            .set('addTeamloading', false)
    }

    updateSettings(action: (settings: SettingsEntity) => SettingsEntity) {
        return this.updateIn(['settings'], action) as this
    }

    updateTeamById(teamId: string, action: (team: TeamEntity) => TeamEntity) {
        
        const teamIndex = this.indexTeamById(teamId)
        if(teamIndex == -1) return this

        return this.updateIn(['teams', teamIndex], action) as this
    }

    updateRound(action: (roundEntity: RoundEntity) => RoundEntity) {
        return this.updateIn(['round'], action) as this
    }

    deleteTeam(teamId: string) {

        const index = this.indexTeamById(teamId)
        if(index < 0) return this

        return this.deleteIn(['teams', index]) as this
    }

    addTeamLoading(loading: boolean) {
        return this.set('addTeamloading', loading)
    }

    teamById(id: string) {
        return this.teams.find(team => team!.id === id)
    }

    indexTeamById(id: string) {
        return this.teams.findIndex(team => team!.id === id)
    }

    teamByIndex(index: number) {
        return this.getIn([ 'teams', index ]) as TeamEntity
    }

    get teams() {
        return this.get('teams') as List<TeamEntity>
    }
}