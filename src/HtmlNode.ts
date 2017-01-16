namespace mirage.html {
    export class HtmlNode extends core.LayoutNode {
        static getElement(node: core.LayoutNode): HTMLElement {
            return node.getAttached("html-element");
        }

        static setElement(node: core.LayoutNode, el: HTMLElement) {
            node.setAttached("html-element", el);
            node.invalidateMeasure();
        }

        protected measureOverride(constraint: ISize): ISize {
            let el = HtmlNode.getElement(this);
            return el ? calcElementDesired(el, constraint) : new Size();
        }

        protected arrangeOverride(arrangeSize: ISize): ISize {
            return arrangeSize;
        }

        static isDummyElement(el: Node): boolean {
            return el === dummy;
        }
    }
    registerNodeType("html", HtmlNode);

    let dummy: HTMLElement;

    function calcElementDesired(el: HTMLElement, constraint: ISize): ISize {
        if (!dummy) {
            dummy = document.createElement('div');
            dummy.id = "mirage-dummy";
            dummy.style.position = "absolute";
            dummy.style.boxSizing = "border-box";
            dummy.style.display = "none";
            document.body.appendChild(dummy);
        }

        dummy.style.width = isFinite(constraint.width) ? `${constraint.width}px` : "";
        dummy.style.height = isFinite(constraint.height) ? `${constraint.height}px` : "";
        dummy.style.display = "";

        dummy.innerHTML = el.outerHTML;
        let clone = <HTMLElement>dummy.firstElementChild;
        clone.style.display = "";
        let bounds = clone.getBoundingClientRect();
        dummy.innerHTML = "";

        dummy.style.display = "none";

        return new Size(bounds.width, bounds.height);
    }
}