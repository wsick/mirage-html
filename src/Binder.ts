namespace mirage.html {
    /*
     The Binder binds a single mirage tree to a single DOM render tree.
     Each DOM element tagged as mirage with a parent not marked as mirage will start a new binder.
     This binding is a bidirectional communication channel.
     - The render tree provides layout inputs and primitive measurements.
     - The layout tree provides resulting slots (x, y, width, height) to place the absolute render elements.
     */

    export interface IBinder {
        getRoot(): core.LayoutNode;
        setRoot(node: core.LayoutNode);
        run();
    }

    export function NewBinder(tree: ITreeTracker): IBinder {
        let root: core.LayoutNode;
        let element: Element;
        let drafter: mirage.draft.IDrafter;
        let lastDraftSize = new Size(NaN, NaN);

        var updater: mirage.draft.IDraftUpdater = {
            updateSlots(updates: draft.ISlotUpdate[]) {
                for (var i = 0; i < updates.length; i++) {
                    let update = updates[i];
                    let el = tree.getElementByNode(update.node);
                    // TODO: updateElement(el, update.node, update.oldRect, update.newRect);
                }
            },
        };

        function getElementSize(el: Element): ISize {
            return new Size(el.scrollWidth, el.scrollHeight);
        }

        return {
            getRoot(): core.LayoutNode {
                return root;
            },
            setRoot(node: core.LayoutNode) {
                Size.undef(lastDraftSize);
                root = node;
                if (!node) {
                    element = null;
                    drafter = null;
                } else {
                    element = tree.getElementByNode(root);
                    drafter = draft.NewDrafter(root);
                }
            },
            run() {
                let rootSize = getElementSize(element);
                if ((root.state.flags & mirage.core.LayoutFlags.hints) > 0 || !Size.isEqual(lastDraftSize, rootSize)) {
                    //root.invalidateMeasure();
                    drafter(updater, rootSize);
                    Size.copyTo(rootSize, lastDraftSize);
                }
            },
        };
    }
}