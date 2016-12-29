namespace mirage.html {
    /*
     The Tree Synchronizer tracks added/removed DOM elements.
     It is responsible for synchronizing the render tree with the layout tree.
     It also detects mirage roots and builds binders.
     */

    export interface ITreeSynchronizer {
        start();
        stop();
    }

    export function NewTreeSynchronizer(target: Node): ITreeSynchronizer {
        var tree = NewTreeTracker();
        var registry = NewBinderRegistry(tree);

        function create(added: Element[]) {
            // Mirror new render elements to layout tree
            for (var i = 0; i < added.length; i++) {
                let el = added[i];
                if (!tree.elementExists(el)) {
                    // The parent may not be mirrored in the layout tree yet
                    // We will set parent after all adds/removes have completed
                    // TODO: get node type
                    let node = mirage.createNodeByType("...");
                    tree.add(el, node);
                }
            }
        }

        function destroy(removed: Element[], addedRoots: core.LayoutNode[], destroyedRoots: core.LayoutNode[]) {
            // Mirror old render elements from layout tree
            // Adds nodes to addedRoots that were orphaned by destroying a root
            // Adds nodes to destroyedRoots that were destroyed mirage parents
            for (var i = 0; i < removed.length; i++) {
                let el = removed[i];
                let node = tree.removeElement(el);
                if (node) {
                    if (!node.tree.parent) {
                        // A binder attached to this node needs adjusted
                        destroyedRoots.push(node);
                        if (el.parentElement) {
                            // Having a parentElement indicates it is in the DOM
                            // Since this was "untagged" with mirage, we need to promote child nodes to roots
                            promoteChildren(el, addedRoots);
                        }
                    }
                    node.setParent(null);
                }
            }
        }

        function promoteChildren(el: Element, addedRoots: core.LayoutNode[]) {
            let cur = el.firstElementChild;
            while (cur) {
                if (isMirageElement(cur)) {
                    addedRoots.push(tree.getNodeByElement(cur));
                } else {
                    promoteChildren(cur, addedRoots);
                }
                cur = cur.nextElementSibling;
            }
        }

        function configParents(added: Element[], addedRoots: core.LayoutNode[]) {
            // Configure parents after all layout nodes have been created/destroyed
            // This is done to ensure parent layout nodes exist
            // Adds nodes to addedRoots that do not have mirage parents
            for (var i = 0; i < added.length; i++) {
                let el = added[i];
                let node = tree.getNodeByElement(el);
                if (el.parentElement && node) {
                    // coerce 'none' types to null
                    node.setParent(tree.getNodeByElement(el.parentElement) || null);
                }
                if (node && !node.tree.parent) {
                    addedRoots.push(node);
                }
            }
        }

        /*
         Each update, we need to
         - construct new layout nodes mirroring new render elements
         - detach layout nodes mirroring old render elements
         - configure all new layout nodes with parent
         - hoist binders to the true root
         - add binders for new root nodes
         */
        function update(added: Element[], removed: Element[]) {
            let addedRoots: core.LayoutNode[] = [];
            let destroyedRoots: core.LayoutNode[] = [];

            create(added);
            destroy(removed, destroyedRoots, addedRoots);
            configParents(added, addedRoots);

            registry.update(addedRoots, destroyedRoots);
        }

        var monitor = NewDOMMonitor(target, update);
        return {
            start() {
                monitor.start();
            },
            stop() {
                monitor.stop();
            },
        };
    }
}