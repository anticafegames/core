import { OrderedMap, List, Record } from 'immutable'

export function generateId() {
  return Date.now() + Math.random()
}

export function objectToOrderedMap(id: string, values: any[], dataRecord: Record.Class) {
    return OrderedMap({[id]: new dataRecord({...values})})
}

export function objectsToOrderedMap(id: string, values: any[], dataRecord: Record.Class) {
  let obj: any = {};
  values.forEach(item => obj[item[id]] = new dataRecord({...item}));
  return OrderedMap(obj)
}

export function arrayToOrderMap<T>(id: string, values: any[], dataRecord: Record.Class) {
  if(!values || !values.length) return null
  return objectsToOrderedMap(id, values, dataRecord)
}

export function arrayToList<T>(values: any[], dataRecord: Record.Class) {
  if(!values || !values.length) return List([])
  values = values.map(item => new dataRecord(item))
  return List(values)
}
