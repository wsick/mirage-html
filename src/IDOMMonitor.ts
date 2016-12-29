namespace mirage.html {
    export interface IDOMMonitor {
        start();
        stop();
    }

    export interface INodeMonitorUpdate {
        (added: Element[], removed: Element[]): void;
    }

    export function NewDOMMonitor(target: Node, onUpdate: INodeMonitorUpdate): IDOMMonitor {
        function isMirageElement(node: Node): boolean {
            // Only consider element nodes
            // Only consider nodes with 'data-layout'
            // Attribute monitor will pick up added/removed attribute
            return node.nodeType === node.ELEMENT_NODE
                && !!(<Element>node).getAttribute("data-layout");
        }

        var observer = new MutationObserver(mutations => {
            var added: Element[] = [];
            var removed: Element[] = [];

            for (var i = 0; i < mutations.length; i++) {
                let mutation = mutations[i];
                if (mutation.type === "childList") {
                    for (var j = 0; j < mutation.addedNodes.length; j++) {
                        let el = mutation.addedNodes[j];
                        if (isMirageElement(el)) {
                            added.push(<Element>el);
                        }
                    }
                    for (var j = 0; j < mutation.removedNodes.length; j++) {
                        let el = mutation.removedNodes[j];
                        if (isMirageElement(el)) {
                            removed.push(<Element>el);
                        }
                    }
                } else if (mutation.type === "attributes") {
                    if (!mutation.oldValue) {
                        if (isMirageElement(mutation.target)) {
                            // 'data-layout' attribute added
                            added.push(<Element>mutation.target);
                        }
                    } else {
                        if (!isMirageElement(mutation.target)) {
                            // 'data-layout' attribute removed
                            removed.push(<Element>mutation.target);
                        }
                    }
                }
            }

            if (added.length > 0 || removed.length > 0) {
                onUpdate(added, removed);
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