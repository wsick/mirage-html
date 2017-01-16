namespace mirage.html {
    /*
     The DOM Monitor is intended to watch the entire DOM and filter for mirage-tagged elements.
     It will report nodes added and removed as a result of DOM tree and attribute changes.
     For instance, if someone deletes the `data-layout` attribute from a DOM element, it will be reported as removed.
     */

    export interface IDOMMonitor {
        start();
        stop();
    }

    export interface INodeMonitorUpdate {
        (added: Element[], removed: Element[], untagged: Element[], changed: IDataLayoutChange[]): void;
    }

    export interface IDataLayoutChange {
        target: Element;
        oldValue: string;
    }

    export function isMirageElement(node: Node): boolean {
        // Only consider element nodes
        // Only consider nodes with 'data-layout'
        // Attribute monitor will pick up added/removed attribute
        return node.nodeType === node.ELEMENT_NODE
            && !!(<Element>node).getAttribute("data-layout");
    }

    export function NewDOMMonitor(target: Node, onUpdate: INodeMonitorUpdate): IDOMMonitor {
        var observer = new MutationObserver(mutations => {
            var added: Element[] = [];
            var removed: Element[] = [];
            var untagged: Element[] = [];
            var changed: IDataLayoutChange[] = [];

            let needsUpdate = false;
            for (var i = 0; i < mutations.length; i++) {
                let mutation = mutations[i];
                if (HtmlNode.isDummyElement(mutation.target))
                    continue;
                if (mutation.type === "childList") {
                    for (var j = 0; j < mutation.addedNodes.length; j++) {
                        let el = mutation.addedNodes[j];
                        if (isMirageElement(el)) {
                            added.push(<Element>el);
                            needsUpdate = true;
                        }
                    }
                    for (var j = 0; j < mutation.removedNodes.length; j++) {
                        let el = mutation.removedNodes[j];
                        if (isMirageElement(el)) {
                            removed.push(<Element>el);
                            needsUpdate = true;
                        }
                    }
                } else if (mutation.type === "attributes") {
                    if (!mutation.oldValue) {
                        if (isMirageElement(mutation.target)) {
                            // 'data-layout' attribute added
                            added.push(<Element>mutation.target);
                            needsUpdate = true;
                        }
                    } else {
                        if (!isMirageElement(mutation.target)) {
                            // 'data-layout' attribute removed
                            untagged.push(<Element>mutation.target);
                            needsUpdate = true;
                        } else {
                            // 'data-layout' attribute changed
                            changed.push({target: <Element>mutation.target, oldValue: mutation.oldValue});
                            needsUpdate = true;
                        }
                    }
                }
            }

            if (needsUpdate) {
                onUpdate(added, removed, untagged, changed);
            }
        });

        return {
            start() {
                observer.observe(target, {
                    childList: true,
                    subtree: true,
                    attributes: true,
                    attributeOldValue: true,
                    attributeFilter: ["data-layout"],
                });
            },
            stop() {
                observer.disconnect();
            },
        };
    }
}