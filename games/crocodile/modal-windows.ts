import Games from "../games"

export type ModalWindowKeys = 'PrepareGame'

export const showCrocodileModal = (name: ModalWindowKeys) => {
    const Game = Games.getGame('crocodile')
    return Game!.modalWindows.showModal(name)
}