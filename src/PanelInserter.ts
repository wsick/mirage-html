namespace mirage.html {
    /*
     When running tree synchronization, child nodes can appear out of order
     The Panel Inserter will track items in escrow
     When ready to commit, each item will be inserted into the proper index
     */

    export interface IPanelInserter {
        add(panel: Panel, el: Element, node: core.LayoutNode);
        commit();
    }

    interface IPanelInsertItem {
        panel: Panel;
        entries: IPanelInsertItemEntry[];
    }
    interface IPanelInsertItemEntry {
        node: core.LayoutNode;
        index: number;
    }

    export function NewPanelInserter(): IPanelInserter {
        var items: IPanelInsertItem[] = [];

        return {
            add(panel: Panel, el: Element, node: core.LayoutNode) {
                let item = panel.getAttached("html-sync-escrow");
                if (!item) {
                    item = {
                        panel: panel,
                        entries: [],
                    };
                    panel.setAttached("html-sync-escrow", item);
                    items.push(item);
                }

                item.entries.push({
                    node: node,
                    index: Array.prototype.indexOf.call(el.parentElement.children, el),
                });
            },
            commit() {
                for (var i = 0; i < items.length; i++) {
                    let item = items[i];
                    let panel = item.panel;
                    let entries = item.entries;
                    panel.setAttached("html-sync-escrow", undefined);
                    entries.sort((a, b) => a.index - b.index);
                    for (var j = 0; j < entries.length; j++) {
                        panel.insertChild(entries[j].node, entries[j].index);
                    }
                }
            },
        };
    }
}