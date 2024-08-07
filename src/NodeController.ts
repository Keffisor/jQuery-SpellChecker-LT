import * as $ from 'jquery';

export class NodeController {
    private element: JQuery;

    constructor(element: JQuery) {
        this.element = element;
    }

    public getPositionedNode(): Node | null {
        let selection = window.getSelection();

        if (selection != null && selection.rangeCount > 0) {
            let element = selection.getRangeAt(0).startContainer.parentElement;
            if(element == this.element[0]) return selection.getRangeAt(0).startContainer;
            return element;
        }

        return null;
    }

    public getCursorPosition(parent: Node, node: Node | null, offset: any, stat: Record<string, any>): Record<string, any> | null {
        if(this.getPositionedNode() == null) return null;
        if(stat.done) return stat;

        let currentNode = null;
        if (parent.childNodes.length == 0 && parent.textContent != null) {
            stat.pos += parent.textContent.length;
            return stat;
        }

        for (let i = 0; i < parent.childNodes.length && !stat.done; i++) {
            currentNode = parent.childNodes[i];
            if (currentNode === node) {
                stat.pos += offset;
                stat.done = true;
                return stat;
            } else this.getCursorPosition(currentNode, node, offset, stat);
        }

        return stat;
    }

    public getElementCoords(element: HTMLElement): Record<string, number> {
        let rects = element.getClientRects()[0];

        let x = rects.left;
        let y = rects.top;

        y = y + this.getScrollCoords()[1];

        return {x: x, y: y};
    }

    public getScrollCoords() : number[] {
        if (window.pageYOffset != null) return [pageXOffset, pageYOffset];

        let sx, sy, d = document, r = d.documentElement, b = d.body;
        sx = r.scrollLeft || b.scrollLeft || 0;
        sy = r.scrollTop || b.scrollTop || 0;
        
        return [sx, sy];
    }

    public setCursorPosition(parent: any, range: any, stat: Record<string, any>, end: boolean = false) {
        if(stat.done) return range;

        if(parent.childNodes.length == 0) {
            if(parent.textContent.length >= stat.pos) {

                if(!end) range.setStart(parent, stat.pos);
                else range.setEnd(parent, stat.pos);

                stat.done = true;
            } else {
                stat.pos = stat.pos - parent.textContent.length;
            }
        } else {
            for(let i = 0; i < parent.childNodes.length && !stat.done; i++) {
                let currentNode = parent.childNodes[i];
                this.setCursorPosition(currentNode, range, stat, end);
            }
        }

        console.log(stat)
        return range;
    }

    public getSelectionPosition() {
        let selection = window.getSelection();

        if (selection && selection.rangeCount > 0) {
            let range = selection.getRangeAt(0);

            let start = range.startOffset;
            let end = range.endOffset;
    
            return {start: start, end: end};
        }

        return null;
    }

    public getSelectionText(): string {
        let html = "";
        
        if(window.getSelection != undefined) {
            const sel = window.getSelection();

            if(sel != null && sel.rangeCount) {
                const container = document.createElement("div");

                for(let i = 0, len = sel.rangeCount; i < len; ++i) {
                    container.appendChild(sel.getRangeAt(i).cloneContents());
                }
                
                html = container.innerText;
            }

        }

        return html;
    }
    
}