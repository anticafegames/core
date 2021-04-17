import Games from "../games"

export type ModalWindowKeys = 'SelectNameModal'

export const showWhoAmIModal = (name: ModalWindowKeys) => {
    const Game = Games.getGame('whoAmI')
    return Game!.modalWindows.showModal(name)
}