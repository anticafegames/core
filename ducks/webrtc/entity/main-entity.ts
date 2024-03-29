import { List, Record } from "immutable"
import PeersConnectionEntity, { iPeersConnection } from "./peer-connection-entity"

export interface iMainEntity {
    localStream?: MediaStream,
    roomId?: string,
    presenter?: iPeersConnection,
    peers: iPeersConnection[] | List<iPeersConnection>,
    update: boolean
}

const defaultParams: iMainEntity = {
    localStream: undefined,
    roomId: undefined,
    presenter: undefined,
    peers: List([]),
    update: false
}

export default class MainEntity extends Record(defaultParams) {

    constructor(params?: iMainEntity) {
        params ? super(params) : super()
    }

    addLocalStream(stream?: MediaStream) {
        return this.set('localStream', stream) as this
    }

    addRoomId(roomId?: string) {
        return this.set('roomId', roomId) as this
    }

    addPeersConnection(connection: iPeersConnection) {

        if(this.isPresenter(connection.userId)) {
            return this.set('presenter', new PeersConnectionEntity(connection)) as this
        } else {
            return this.updateIn(['peers'], list => list.merge(list.push(new PeersConnectionEntity(connection)))) as this
        }
    }

    deletePeersConnection(userId: string) {
        if(this.isPresenter(userId)) {
            return this.set('presenter', null) as this
        } else {
            return this.peerConnectionAction(userId, index => this.deleteIn(['peers', index]) as this) 
        }
    }

    deleteAllPeers() {
        return this.set('peers', List([])) as this
    }

    addTrack(userId: string, track: MediaStreamTrack) {
        
        if(this.isPresenter(userId)) { 

            const ent = this.get('presenter').set('track', track)

            return this.set('presenter', ent) as this
        } else {
            return this.peerConnectionAction(userId, index => this.setIn(['peers', index, 'track'], track) as this)
        }
    }

    addChannel(userId: string, channel: RTCDataChannel) {
        if(this.isPresenter(userId)) { 
            return this.setIn(['presenter', 'channel'], channel) as this
        } else {
            return this.peerConnectionAction(userId, index => this.setIn(['peers', index, 'channel'], channel) as this)
        }
    }

    updateProps() {
        return this.set('update', !this.get('update')) as this
    }

    getPeerIndex(userId: string) {
        const peers = this.getPeers()
        return peers.findIndex(peer => peer!.userId === userId)
    }

    getPeers() {
        return this.get('peers') as List<PeersConnectionEntity>
    }

    peerConnectionAction(userId: string, action: (index: number) => this) {

        const peerIndex = this.getPeerIndex(userId)

        if(peerIndex !== -1) {
            return action(peerIndex) as this
        }

        return this
    }

    isPresenter(userId: string) {
        return userId === 'presenter'
    }
}

