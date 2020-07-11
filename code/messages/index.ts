
export const infoMessage = (message: string, ...args: any[]) => console.info(message, ...args)
export const errorMessage = (message: string, ...args: any[]) => console.error(message, ...args)

export const todo = (message: string, path: string) => console.log(`TODO: ${message}, PATH: ${path}`)