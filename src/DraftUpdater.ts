namespace mirage.html {
    export function NewDraftUpdater(tree: ITreeTracker): mirage.draft.IDraftUpdater {
        function updateSlot(el: HTMLElement, slot: IRect) {
            el.style.position = "absolute";
            el.style.left = `${slot.x}px`;
            el.style.top = `${slot.y}px`;
            el.style.width = `${slot.width}px`;
            el.style.height = `${slot.height}px`;
            el.style.boxSizing = "border-box";
        }

        return {
            updateSlots(updates: draft.ISlotUpdate[]) {
                for (var i = 0; i < updates.length; i++) {
                    let update = updates[i];
                    let node = update.node;

                    let el = <HTMLElement>tree.getElementByNode(update.node);
                    el.style.display = "none";
                    if (node.tree.parent)
                        updateSlot(<HTMLElement>tree.getElementByNode(update.node), update.newRect);
                    el.style.display = "";
                }
            },
        };
    }
}