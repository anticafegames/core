import React from 'react'

import { showElement } from '../../../ducks/modal'
import GameBoard from '../../../components/games/who-am-i/game-board'

export default () => {
    return showElement(close => <GameBoard closeWindow={close} />, { className: 'who-am-i-game-board', canCloseOnOverlay: false })
}