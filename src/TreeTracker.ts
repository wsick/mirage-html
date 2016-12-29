namespace mirage.html {
    /*
     The Tree Tracker tracks render elements (DOM) and layout nodes (mirage).
     This is a singleton and tracks the entire DOM.
     Instead of doing lookups using a synchronized double-array, we are tracking a uid on each object.
     The render element and layout node can be retrieved by uid.
     We use a DOM attribute ('http://schemas.wsick.com/mirage/html':uid)
     and a layout node attached property ('mirage-uid') to track the uid.
     This uid is a running int counter that is converted to a string to match attributes.
     */

    var XMLNS = "http://schemas.wsick.com/mirage/html";

    export interface ITreeTracker {
        add(el: Element, node: core.LayoutNode): string;
        removeElement(el: Element);
        elementExists(el: Element): boolean;
        getNodeByElement(el: Element): core.LayoutNode;
        getElementByNode(node: core.LayoutNode): Element;
    }

    interface IElementHash {
        [uid: string]: Element;
    }
    interface ILayoutNodeHash {
        [uid: string]: core.LayoutNode;
    }

    export function NewTreeTracker(): ITreeTracker {
        var elements: IElementHash = {};
        var nodes: ILayoutNodeHash = {};
        var lastUid = 0;

        return {
            add(el: Element, node: core.LayoutNode): string {
                lastUid++;
                var uid = lastUid.toString();
                el.setAttributeNS(XMLNS, "uid", uid);
                node.setAttached("mirage-uid", uid);
                nodes[uid] = node;
                return uid;
            },
            removeElement(el: Element): core.LayoutNode {
                var uid = el.getAttributeNS(XMLNS, "uid");
                var node = !uid ? null : nodes[uid];
                el.removeAttributeNS(XMLNS, "uid");
                if (node) {
                    node.setAttached("mirage-uid", undefined);
                    delete elements[uid];
                    delete nodes[uid];
                }
                return node;
            },
            elementExists(el: Element): boolean {
                var uid = el.getAttributeNS(XMLNS, "uid");
                return elements[uid] === el;
            },
            getNodeByElement(el: Element): core.LayoutNode {
                var uid = el.getAttributeNS(XMLNS, "uid");
                return nodes[uid];
            },
            getElementByNode(node: core.LayoutNode): Element {
                var uid = node.getAttached("mirage-uid");
                return elements[uid];
            },
        };
    }

    export function getNodeUid(node: core.LayoutNode): string {
        return node.getAttached("mirage-uid");
    }
}