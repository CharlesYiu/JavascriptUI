import { JSDOM } from "jsdom"

export enum Font { title, text }
export type Content = () => void
type CurrentContent = Array<_Element>
let currentContent:CurrentContent = []

class _Element {
    public modifyElement(document: Document, element: HTMLElement, parent?: HTMLDivElement): HTMLElement {
        element.style.paddingTop = `${this._padding[0]}px`
        element.style.paddingBottom = `${this._padding[1]}px`
        element.style.paddingLeft = `${this._padding[2]}px`
        element.style.paddingRight = `${this._padding[3]}px`

        element.style.marginTop = `${this._margin[0]}px`
        element.style.marginBottom = `${this._margin[1]}px`
        element.style.marginLeft = `${this._margin[2]}px`
        element.style.marginRight = `${this._margin[3]}px`

        element.style.flex = "0 1 auto"
        return element
    }
    public toElement(document: Document, parent?: HTMLDivElement): HTMLElement {
        return document.createElement("a")
    }

    private _margin: Array<number> = [0, 0, 0, 0]
    public margin(all: number, top?: number, bottom?: number, left?: number, right?: number): typeof this {
        this._margin = [
            (typeof top === "undefined" ? all : top),
            (typeof bottom === "undefined" ? all : bottom),
            (typeof left === "undefined" ? all : left),
            (typeof right === "undefined" ? all : right)
        ]
        return this
    }
    private _padding: Array<number> = [0, 0, 0, 0]
    public padding(all: number, top?: number, bottom?: number, left?: number, right?: number): typeof this {
        this._padding = [
            (typeof top === "undefined" ? all : top),
            (typeof bottom === "undefined" ? all : bottom),
            (typeof left === "undefined" ? all : left),
            (typeof right === "undefined" ? all : right)
        ]
        return this
    }

    constructor() { currentContent.push(this) }
}

class _Content extends _Element {
    content: CurrentContent = []

    public modifyElement(document: Document, element: HTMLDivElement): HTMLDivElement {
        element = super.modifyElement(document, element) as HTMLDivElement
        this.content.forEach(_element => element.appendChild(_element.toElement(document, element)))
        return element
    }
    public toElement(document: Document): HTMLDivElement {
        return this.modifyElement(document, document.createElement("div"))
    }
    
    constructor(content: Content) {
        super()
        const originalContent = currentContent
        currentContent = []
        content()
        this.content = currentContent
        currentContent = originalContent
    }
}
export function Group(content: Content): _Content { return new _Content(content) }

class _Body extends _Content {
    public toDocument(document: Document) {
        document.body.style.margin = "unset"
        document.body.style.display = "flex"
        document.body.style.flexFlow = "column"
        document.body.style.height, document.body.style.width = "100%"
        document.body.appendChild(this.toElement(document))
    }
    public modifyElement(document: Document, element: HTMLDivElement): HTMLDivElement {
        element.style.margin = "unset"
        element.style.display = "flex"
        element.style.flexFlow = "column"
        element.style.height, element.style.width = "100%"
        element = super.modifyElement(document, element) as HTMLDivElement
        return element
    }
}
export function Body(content: Content): _Body {
    const originalContent = currentContent
    currentContent = []
    const body = new _Body(content)
    // code below are for testing (printing the generated html)
    const dom = new JSDOM()
    body.toDocument(dom.window.document)
    console.log(dom.serialize())
    currentContent = originalContent
    return body
}

class _Events { }
export function Events(content: Content): _Events { return new _Events() }

export interface View {
    events?: _Events
    body?: _Content
}

class _HStack extends _Content {
    constructor(content: Content) { super(content) }

    public modifyElement(document: Document, element: HTMLDivElement): HTMLDivElement {
        element.style.flexFlow = "row"
        element.style.display = "flex"
        return super.modifyElement(document, element) as HTMLDivElement
    }
    public toElement(document: Document): HTMLDivElement {
        return this.modifyElement(document, document.createElement("div"))
    }
}
export function HStack(content: Content): _HStack { return new _HStack(content) }

class _VStack extends _Content {
    constructor(content: Content) { super(content) }

    public modifyElement(document: Document, element: HTMLDivElement): HTMLDivElement {
        element.style.flexFlow = "column"
        element.style.display = "flex"
        return super.modifyElement(document, element) as HTMLDivElement
    }
    public toElement(document: Document): HTMLDivElement {
        return this.modifyElement(document, document.createElement("div"))
    }
}
export function VStack(content: Content): _VStack { return new _VStack(content) }

class _Divider extends _Element {
    constructor() { super() }
    public modifyElement(document: Document, element: HTMLSpanElement, parent?: HTMLDivElement): HTMLSpanElement {
        element = super.modifyElement(document, element, parent) as HTMLSpanElement
        element.style.backgroundColor = "#000000"
        const size = parent.style.flexFlow === "column" ? ["auto", "5px"] : ["5px", "auto"]
        console.log("" + parent.style.flexFlow)
        element.style.width = size[0]
        element.style.height = size[1]
        return element
    }
    public toElement(document: Document, parent?: HTMLDivElement): HTMLSpanElement {
        return this.modifyElement(document, document.createElement("span"), parent)
    }
}
export function Divider(): _Divider { return new _Divider() }

class _Spacer extends _Element {
    public modifyElement(document, element: HTMLDivElement, parent?: HTMLDivElement): HTMLDivElement {
        element = super.modifyElement(document, element) as HTMLDivElement
        element.style.flex = "1 1 auto"
        return element
    }
    public toElement(document: Document, parent?: HTMLDivElement): HTMLDivElement {
        return this.modifyElement(document, document.createElement("div"), parent)
    }
}
export function Spacer(): _Spacer { return new _Spacer() }

class _Text extends _Element {
    public text: string
    constructor(text: string) {
        super()
        this.text = text
    }

    public modifyElement(document: Document, element: HTMLHeadingElement | HTMLParagraphElement, parent?: HTMLDivElement): HTMLHeadingElement | HTMLParagraphElement {
        element = super.modifyElement(document, element) as HTMLHeadingElement | HTMLParagraphElement
        element.textContent = this.text
        element.style.fontWeight = this._bold ? "bold" : "normal"
        element.style.fontStyle = this._italic ? "italic" : "normal"
        element.style.textDecoration = this._underline ? "underline" : "none"
        return element
    }
    public toElement(document: Document, parent?: HTMLDivElement): HTMLHeadingElement | HTMLParagraphElement {
        return this.modifyElement(document, document.createElement(this._font === Font.text ? "p" : "h1"), parent)
    }

    private _font: Font = Font.text
    public font(font: Font): typeof this {
        this._font = font
        return this
    }
    private _bold: boolean = false
    public bold(bold: boolean = true): typeof this {
        this._bold = bold
        return this
    }
    private _italic: boolean = false
    public italic(italic: boolean = true): typeof this {
        this._italic = italic
        return this
    }
    private _underline: boolean = false
    public underline(underline: boolean = true): typeof this {
        this._underline = underline
        return this
    }
}
export function Text(text: string): _Text { return new _Text(text) }