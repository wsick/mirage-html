namespace mirage.html {
    /*
     The Tree Synchronizer tracks added/removed DOM elements.
     It is responsible for synchronizing the render tree with the layout tree.
     It also detects mirage roots and builds binders.
     */

    // TODO: We are currently using setParent to configure layout tree
    // Instead, we should either
    // - add child to Panel
    // - set single child if node type allows it

    export interface ITreeSynchronizer {
        start();
        stop();
    }

    export function NewTreeSynchronizer(target: Node, tree?: ITreeTracker, registry?: IBinderRegistry): ITreeSynchronizer {
        tree = tree || NewTreeTracker();
        registry = registry || NewBinderRegistry(tree);

        function mirrorAdded(added: Element[]) {
            // Mirror new render elements to layout tree
            for (var i = 0; i < added.length; i++) {
                register(added[i]);
            }
        }

        function mirrorUntagged(untagged: Element[], addedRoots: core.LayoutNode[], destroyedRoots: core.LayoutNode[]) {
            // Mirror nodes that have been untagged, but remain in DOM
            for (var i = 0; i < untagged.length; i++) {
                deregister(untagged[i], true, addedRoots, destroyedRoots);
            }
        }

        function mirrorRemoved(removed: Element[], addedRoots: core.LayoutNode[], destroyedRoots: core.LayoutNode[]) {
            // Mirror old render elements from layout tree
            // Adds nodes to addedRoots that were orphaned by destroying a root
            // Adds nodes to destroyedRoots that were destroyed mirage parents
            for (var i = 0; i < removed.length; i++) {
                deregister(removed[i], false, addedRoots, destroyedRoots);
            }
        }

        function register(el: Element) {
            if (tree.elementExists(el) || !isMirageElement(el))
                return;
            // The parent may not be mirrored in the layout tree yet
            // We will set parent after all adds/removes have completed
            // TODO: get node type
            let node = mirage.createNodeByType("...");
            tree.add(el, node);

            // register children
            for (let cur = el.firstElementChild; !!cur; cur = cur.nextElementSibling) {
                register(cur);
            }
        }

        function deregister(el: Element, isUntagged: boolean, addedRoots: core.LayoutNode[], destroyedRoots: core.LayoutNode[]) {
            let node = tree.removeElement(el);
            if (!node)
                return;
            if (!isUntagged) {
                // deregister children
                for (let cur = el.firstElementChild; !!cur; cur = cur.nextElementSibling) {
                    deregister(cur, true, null, null);
                }
            }

            if (!node.tree.parent) {
                destroyedRoots.push(node);
                promoteChildren(el, addedRoots);
            }

            node.setParent(null);
        }

        function promoteChildren(el: Element, addedRoots: core.LayoutNode[]) {
            for (let cur = el.firstElementChild; !!cur; cur = cur.nextElementSibling) {
                if (isMirageElement(cur)) {
                    addedRoots.push(tree.getNodeByElement(cur));
                } else {
                    promoteChildren(cur, addedRoots);
                }
            }
        }

        function mirrorAncestry(added: Element[], addedRoots: core.LayoutNode[]) {
            // Configure parents after all layout nodes have been created/destroyed
            // This is done to ensure parent layout nodes exist
            // Adds nodes to addedRoots that do not have mirage parents
            for (var i = 0; i < added.length; i++) {
                let el = added[i];
                let node = tree.getNodeByElement(el);
                if (!node)
                    continue;
                // coerce 'none' to null
                node.setParent((el.parentElement ? tree.getNodeByElement(el.parentElement) : null) || null);
                if (!node.tree.parent) {
                    addedRoots.push(node);
                }
                configAncestors(el, node);
            }
        }

        function configAncestors(parentEl: Element, parentNode: core.LayoutNode) {
            for (let cur = parentEl.firstElementChild; !!cur; cur = cur.nextElementSibling) {
                let curNode = tree.getNodeByElement(cur);
                if (curNode && !curNode.tree.parent) {
                    curNode.setParent(parentNode);
                    configAncestors(cur, curNode);
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
        function update(added: Element[], removed: Element[], untagged: Element[]) {
            let addedRoots: core.LayoutNode[] = [];
            let destroyedRoots: core.LayoutNode[] = [];

            mirrorAdded(added);
            mirrorUntagged(untagged, addedRoots, destroyedRoots);
            mirrorRemoved(removed, addedRoots, destroyedRoots);
            mirrorAncestry(added, addedRoots);

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