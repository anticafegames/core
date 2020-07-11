import { OutputSelector } from "reselect"

export interface iSocketType {
    selector: OutputSelector<any, any, any>
    connectSuccessConst: string,
    eventsSelector: OutputSelector<any, any, any>,
    addEventsKey: string,
    deleteEventsKey: string
}