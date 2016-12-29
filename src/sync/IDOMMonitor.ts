namespace mirage.html.sync {
    export interface IDOMMonitor {
        start();
        stop();
    }

    export function NewDOMMonitor(target: Node, onNodeAdded: (node: Node, parent: Node) => void, onNodeRemoved: (node: Node, parent: Node) => void): IDOMMonitor {
        function nodeHasLayoutAttr(node: Node): boolean {
            return !!(<Element>node).getAttribute("data-layout");
        }

        function addElement(node: Node, parent: Node) {
            // Only consider element nodes
            if (node.nodeType !== node.ELEMENT_NODE)
                return;
            // Only consider nodes with 'data-layout'
            // Attribute monitor will pick up added nodes that add attr later
            if (!nodeHasLayoutAttr(node))
                return;
            onNodeAdded(node, parent);
        }

        function removeElement(node: Node, parent: Node) {
            // Only consider element nodes
            if (node.nodeType !== node.ELEMENT_NODE)
                return;
            // Only consider nodes with 'data-layout'
            // Attribute monitor will pick up removed nodes that previously remove attr
            if (!nodeHasLayoutAttr(node))
                return;
            onNodeRemoved(node, parent);
        }

        var observer = new MutationObserver(mutations => {
            for (var i = 0; i < mutations.length; i++) {
                let mutation = mutations[i];
                if (mutation.type === "childList") {
                    for (var j = 0; j < mutation.addedNodes.length; j++) {
                        addElement(mutation.addedNodes[j], mutation.target);
                    }
                    for (var j = 0; j < mutation.removedNodes.length; j++) {
                        removeElement(mutation.removedNodes[j], mutation.target);
                    }
                } else if (mutation.type === "attributes") {
                    if (!mutation.oldValue) {
                        if (nodeHasLayoutAttr(mutation.target)) {
                            // 'data-layout' attribute added
                            addElement(mutation.target, mutation.target.parentElement);
                        }
                    } else {
                        if (!nodeHasLayoutAttr(mutation.target)) {
                            // 'data-layout' attribute removed
                            removeElement(mutation.target, mutation.target.parentElement);
                        }
                    }
                }
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