namespace mirage.html.tests {
    QUnit.module("TreeSynchronizer");


    QUnit.test("update", (assert) => {
        var done = assert.async();

        var testRoot = document.createElement('div');
        testRoot.id = "TreeSynchronizer-root1";
        document.body.appendChild(testRoot);

        var tree = NewTreeTracker();
        var binders: IBinder[] = [];
        var registry = NewBinderRegistry(tree, binders);
        var syncer = NewTreeSynchronizer(testRoot, tree, registry);
        syncer.start(false);

        function getBinderTuple(binder: IBinder): {el: Element; node: core.LayoutNode;} {
            var node = binder.getRoot();
            return {
                el: tree.getElementByNode(node),
                node: node,
            };
        }

        // Pass 1 - add basic tree
        testRoot.innerHTML = `
<div id="root" data-layout="type: stack-panel">
    <div id="child1" data-layout="type: none">
        <div id="gchild1" data-layout="type: none"></div>
    </div>
    <div id="child2" data-layout="type: none"></div>
    <div id="child3" data-layout="type: none"></div>
</div>
`;
        window.setTimeout(() => {
            assert.strictEqual(binders.length, 1, "pass 1 length");
            let root = getBinderTuple(binders[0]);
            assert.strictEqual(root.el ? root.el.id : null, "root", "pass 1 - binder 1");

            for (let i = 0, cur = root.el.firstElementChild; !!cur; i++, cur = cur.nextElementSibling) {
                let curNode = tree.getNodeByElement(cur);
                assert.strictEqual(curNode ? curNode.tree.parent : null, root.node, `pass 1 - child ${i} parent`);
            }

            // Pass 2 - untag root
            root.el.removeAttribute("data-layout");
            window.setTimeout(() => {
                assert.strictEqual(binders.length, 3, "pass 2 length");
                let child1 = getBinderTuple(binders[0]);
                assert.strictEqual(child1.el ? child1.el.id : null, "child1", "pass 2 - binder 1");
                let child2 = getBinderTuple(binders[1]);
                assert.strictEqual(child2.el ? child2.el.id : null, "child2", "pass 2 - binder 2");
                let child3 = getBinderTuple(binders[2]);
                assert.strictEqual(child3.el ? child3.el.id : null, "child3", "pass 2 - binder 3");

                // Pass 3 - hoist child1 to root
                root.el.setAttribute("data-layout", "type: stack-panel");
                window.setTimeout(() => {
                    assert.strictEqual(binders.length, 1, "pass 3 length");
                    let rootPass3 = getBinderTuple(binders[0]);
                    assert.strictEqual(rootPass3.el ? rootPass3.el.id : null, "root", "pass 3 - binder 1");

                    syncer.stop();
                    done();
                }, 1);
            }, 1);
        }, 1);
    });
}