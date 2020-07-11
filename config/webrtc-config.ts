
export const serverConfiguration: RTCConfiguration = {
    iceServers: [
        { urls: "turn:turn.anticafeturn.ru:443?transport=tcp", credential: "501c59d8d525a6a6f2042dbcc638c927", username: "anticafeturnuser" }
    ],
    iceCandidatePoolSize: 20
}

export const offerOptions: RTCOfferOptions = { iceRestart: true }
export const answerOptions: RTCAnswerOptions = {}