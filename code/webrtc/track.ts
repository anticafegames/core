class Track {

    static listenOnTrack: (connection: RTCPeerConnection, emit: any) => () => void
    static addTrack: (connection: RTCPeerConnection, mediaStream: MediaStream) => void

}

export default Track