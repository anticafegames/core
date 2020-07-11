export const isMuted = (localStream?: MediaStream) => {

    if (!localStream) {
        return false
    }

    const [audioTrack] = localStream.getAudioTracks()

    if (!audioTrack) {
        return false
    }

    return !audioTrack.enabled
}