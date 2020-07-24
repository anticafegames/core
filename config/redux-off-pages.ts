declare var window: any

const reduxOffPages = [
    '/auth'
]

export default reduxOffPages.includes(window.location.pathname)