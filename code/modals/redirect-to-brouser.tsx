import React from 'react'

import { showElement } from '../../ducks/modal'

import RedirectToBrouser from '../../../pages/modals/redirect-to-brouser'

export default () => showElement(close => <RedirectToBrouser />, { className: 'redirect-to-brouser', canCloseOnOverlay: false, withFooter: false })