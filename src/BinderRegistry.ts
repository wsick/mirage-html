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
        let roots: core.LayoutNode[] = [];
        binders = binders || [];

        // roots tracks the list of roots that are contained within binders
        function findHoistCandidate(binder: IBinder): core.LayoutNode {
            let curRoot = binder.getRoot();
            if (!curRoot)
                return null;
            let newRoot = curRoot;
            // walk up the tree until we find a node without a parent
            while (newRoot.tree.parent) {
                newRoot = newRoot.tree.parent;
            }
            if (newRoot === curRoot)
                return null;
            // if this is already being tracked by a binder, this is not a candidate
            if (roots.indexOf(newRoot) > -1)
                return null;
            return newRoot;
        }

        function hoist(addedRoots: core.LayoutNode[]): core.LayoutNode[] {
            // Hoist binders to the root
            // This is done to ensure that a binder is the true root
            // as a root may be slipped above an existing binder root
            // Return added nodes that do not have binders as new root binder candidates
            let missingBinderNodes: core.LayoutNode[] = addedRoots.slice(0);
            for (var i = 0; i < binders.length; i++) {
                let binder = binders[i];
                let newRoot = findHoistCandidate(binder);
                if (!newRoot) {
                    // Since this binder has no candidate, let's destroy it
                    binders.splice(i, 1);
                    i--;
                    continue;
                }
                binder.setRoot(newRoot);
                roots.push(newRoot);
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
                roots.push(node);
                binders.push(binder);
            }
        }

        function adjustDestroyed(destroyedRoots: core.LayoutNode[]) {
            for (var i = 0; i < binders.length; i++) {
                let binder = binders[i];
                let curRoot = binder.getRoot();
                let index = destroyedRoots.indexOf(curRoot);
                if (index > -1) {
                    // Root was destroyed, let's destroy this binder
                    binders.splice(index, 1);
                    i--;
                    // Stop tracking this root as bound
                    binder.setRoot(null);
                    let trackIndex = roots.indexOf(curRoot);
                    if (trackIndex > -1)
                        roots.splice(trackIndex, 1);
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