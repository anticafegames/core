export class GameManual {

    previewImage: string
    manual: () => JSX.Element
    addData?: () => JSX.Element

    constructor(previewImage: string, manual: () => JSX.Element, addData?: () => JSX.Element) {
        this.previewImage = previewImage
        this.manual = manual
        this.addData = addData
    }
}