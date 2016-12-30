namespace mirage.html {
    /*
     The Tree Synchronizer tracks added/removed DOM elements.
     It is responsible for synchronizing the render tree with the layout tree.
     It also detects mirage roots and builds binders.
     */

    export interface ITreeSynchronizer {
        start(initialize: boolean);
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

            let parentNode = node.tree.parent;
            if (!parentNode) {
                destroyedRoots.push(node);
                promoteChildren(el, addedRoots);
            }

            if (parentNode instanceof Panel) {
                parentNode.removeChild(node);
            } else {
                node.setParent(null);
            }
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

        function mirrorAncestry(added: Element[], addedRoots: core.LayoutNode[], inserter: IPanelInserter) {
            // Configure parents after all layout nodes have been created/destroyed
            // This is done to ensure parent layout nodes exist
            // Adds nodes to addedRoots that do not have mirage parents
            for (var i = 0; i < added.length; i++) {
                let el = added[i];
                let node = tree.getNodeByElement(el);
                if (!node)
                    continue;
                // coerce 'none' to null
                let parentNode = (el.parentElement ? tree.getNodeByElement(el.parentElement) : null) || null;
                if (parentNode instanceof Panel) {
                    // To ensure proper ordering, we will collect all new children for each parent
                    // We will insert the children in sorted order
                    inserter.add(parentNode, el, node);
                } else {
                    node.setParent(parentNode);
                }
                if (!node.tree.parent) {
                    addedRoots.push(node);
                }
                configAncestors(el, node, inserter);
            }
        }

        function configAncestors(parentEl: Element, parentNode: core.LayoutNode, inserter: IPanelInserter) {
            for (let cur = parentEl.firstElementChild, i = 0; !!cur; cur = cur.nextElementSibling, i++) {
                let curNode = tree.getNodeByElement(cur);
                if (curNode && !curNode.tree.parent) {
                    if (parentNode instanceof Panel) {
                        inserter.add(parentNode, cur, curNode);
                    } else {
                        curNode.setParent(parentNode);
                    }
                    configAncestors(cur, curNode, inserter);
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
            let inserter = NewPanelInserter();
            let addedRoots: core.LayoutNode[] = [];
            let destroyedRoots: core.LayoutNode[] = [];

            mirrorAdded(added);
            mirrorUntagged(untagged, addedRoots, destroyedRoots);
            mirrorRemoved(removed, addedRoots, destroyedRoots);
            mirrorAncestry(added, addedRoots, inserter);

            inserter.commit();
            registry.update(addedRoots, destroyedRoots);
        }

        function init() {
            let added: Element[] = [];
            scan(<Element>target, added);
            update(added, [], []);
        }

        function scan(el: Element, added: Element[]) {
            if (isMirageElement(el))
                added.push(el);
            for (let cur = el.firstElementChild; !!cur; cur = cur.nextElementSibling) {
                scan(cur, added);
            }
        }

        var monitor = NewDOMMonitor(target, update);
        return {
            start(initialize: boolean) {
                if (initialize)
                    init();
                monitor.start();
            },
            stop() {
                monitor.stop();
            },
        };
    }
}