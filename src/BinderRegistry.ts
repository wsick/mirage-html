namespace mirage.html {
    /*
     The Binder Registry is intended to track all Binders.
     This is a singleton and will track all binders.
     Additionally, it will adjust registered binders after a structural tree change.
     */

    export interface IBinderRegistry {
        update(addedRoots: core.LayoutNode[], destroyedRoots: core.LayoutNode[]);
    }

    export function NewBinderRegistry(tree: ITreeTracker, binders?: IBinder[]): IBinderRegistry {
        binders = binders || [];

        function hoist(addedRoots: core.LayoutNode[]): core.LayoutNode[] {
            // Hoist binders to the root
            // This is done to ensure that a binder is the true root
            // as a root may be slipped above an existing binder root
            // Return added nodes that do not have binders as new root binder candidates
            let missingBinderNodes: core.LayoutNode[] = addedRoots.slice(0);
            for (var i = 0; i < binders.length; i++) {
                let binder = binders[i];
                let curRoot = binder.getRoot();
                if (!curRoot) {
                    // Drop unused binder
                    binders.splice(i, 1);
                    i--;
                    continue;
                }
                let newRoot = curRoot;
                while (newRoot.tree.parent) {
                    newRoot = newRoot.tree.parent;
                }
                if (newRoot !== curRoot) {
                    binder.setRoot(newRoot);
                }
                // If this binder matches an added root,
                // it should be excluded from missing binder nodes
                let missingIndex = missingBinderNodes.indexOf(newRoot);
                if (missingIndex > -1) {
                    missingBinderNodes.splice(missingIndex, 1);
                }
            }
            return missingBinderNodes;
        }

        function create(nodes: core.LayoutNode[]) {
            for (var i = 0; i < nodes.length; i++) {
                let node = nodes[i];
                let binder = NewBinder(tree);
                binder.setRoot(node);
                binders.push(binder);
            }
        }

        function adjustDestroyed(destroyedRoots: core.LayoutNode[]) {
            for (var i = 0; i < binders.length; i++) {
                let binder = binders[i];
                let index = destroyedRoots.indexOf(binder.getRoot());
                if (index > -1) {
                    // Root was destroyed, let's destroy this binder
                    binder.setRoot(null);
                    binders.splice(index, 1);
                    i--;
                }
            }
        }

        return {
            update(addedRoots: core.LayoutNode[], destroyedRoots: core.LayoutNode[]) {
                let missingBinderNodes = hoist(addedRoots);
                create(missingBinderNodes);
                adjustDestroyed(destroyedRoots);
            },
        };
    }
}