export const ignoreReconnectLocations = ['debug']
export const ignoreReconnect = (pathname: string) => ignoreReconnectLocations.some(location => pathname.startsWith(location + '/'))