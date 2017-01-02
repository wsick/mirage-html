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
        let element: HTMLElement;
        let drafter: mirage.draft.IDrafter;
        let lastDraftSize = new Size(NaN, NaN);

        function updateSlot(el: HTMLElement, slot: IRect) {
            el.style.position = "absolute";
            el.style.left = `${slot.x}px`;
            el.style.top = `${slot.y}px`;
            el.style.width = `${slot.width}px`;
            el.style.height = `${slot.height}px`;
        }

        var updater: mirage.draft.IDraftUpdater = {
            updateSlots(updates: draft.ISlotUpdate[]) {
                for (var i = 0; i < updates.length; i++) {
                    let update = updates[i];
                    if (update.node !== root)
                        updateSlot(<HTMLElement>tree.getElementByNode(update.node), update.newRect);
                }
            },
        };

        function getRootSize(): ISize {
            let htmlHeight = root.getAttached("html.height");
            if (htmlHeight === "window")
                return new Size(window.innerWidth, window.innerHeight - 20);
            return new Size(element.scrollWidth, element.scrollHeight);
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
                    element = <HTMLElement>tree.getElementByNode(root);
                    drafter = draft.NewDrafter(root);
                }
            },
            run() {
                let rootSize = getRootSize();
                if ((root.state.flags & mirage.core.LayoutFlags.hints) > 0 || !Size.isEqual(lastDraftSize, rootSize)) {
                    drafter(updater, rootSize);
                    Size.copyTo(rootSize, lastDraftSize);
                }
            },
        };
    }
}