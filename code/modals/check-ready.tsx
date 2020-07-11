import React from 'react'

import { showElement } from '../../ducks/modal'

import CheckReadyModal from '../../../components/games/select-game/check-ready'

export default () => {
    return showElement(close => <CheckReadyModal closeModalWindow={close} />, { className: 'check-ready-modal', canCloseOnOverlay: false, withFooter: false })
}