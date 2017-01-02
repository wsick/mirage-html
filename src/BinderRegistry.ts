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

        function hoist(addedRoots: core.LayoutNode[], destroyedRoots: core.LayoutNode[]) {
            // Hoist binders to the root
            // This is done to ensure that a binder is the true root
            // as a root may be slipped above an existing binder root
            // Added roots will be stripped of hoisted roots from existing binders
            for (var i = 0; i < binders.length; i++) {
                let binder = binders[i];
                let curRoot = binder.getRoot();
                if (!curRoot) {
                    // Dead binder, destroy it
                    binders.splice(i, 1);
                    i--;
                    continue;
                }
                let newRoot = findRoot(curRoot);
                if (curRoot !== newRoot) {
                    replaceBinderRoot(binder, curRoot, newRoot, destroyedRoots);
                }

                // If this binder was taken over by newRoot and exists in addedRoots,
                // we should remove so a duplicate binder isn't created
                let existingIndex = addedRoots.indexOf(newRoot);
                if (existingIndex > -1)
                    addedRoots.splice(i, 1);
            }
        }

        function findRoot(curRoot: core.LayoutNode): core.LayoutNode {
            let newRoot = curRoot;
            while (newRoot.tree.parent) {
                newRoot = newRoot.tree.parent;
            }
            return newRoot;
        }

        function replaceBinderRoot(binder: IBinder, curRoot: core.LayoutNode, newRoot: core.LayoutNode, destroyedRoots: core.LayoutNode[]) {
            // Replace this binder's root with newRoot

            // If newRoot already has a binder, this binder should be destroyed
            if (roots.indexOf(newRoot) > -1) {
                destroyedRoots.push(curRoot);
                return;
            }

            // stop tracking current root
            let oldIndex = roots.indexOf(curRoot);
            if (oldIndex > -1)
                roots.splice(oldIndex, 1);

            binder.setRoot(newRoot);
            roots.push(newRoot);
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

        function destroy(destroyedRoots: core.LayoutNode[]) {
            for (var i = 0; i < binders.length; i++) {
                let index = destroyedRoots.indexOf(binders[i].getRoot());
                if (index > -1) {
                    destroyBinder(index);
                    i--;
                }
            }
        }

        function destroyBinder(index: number) {
            let binder = binders.splice(index, 1)[0];
            let curRoot = binder.getRoot();
            binder.setRoot(null);
            if (curRoot) {
                // Stop tracking this root as bound
                let trackIndex = roots.indexOf(curRoot);
                if (trackIndex > -1)
                    roots.splice(trackIndex, 1);
            }
        }

        return {
            update(addedRoots: core.LayoutNode[], destroyedRoots: core.LayoutNode[]) {
                hoist(addedRoots, destroyedRoots);
                create(addedRoots);
                destroy(destroyedRoots);
            },
        };
    }
}