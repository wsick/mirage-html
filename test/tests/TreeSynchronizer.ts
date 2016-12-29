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
        syncer.start();

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
            var rootNode = <Panel>binders[0].getRoot();
            var root = tree.getElementByNode(rootNode);
            assert.strictEqual(root ? root.id : null, "root", "pass 1 - binder 1");

            // Pass 2 - untag root
            root.removeAttribute("data-layout");
            window.setTimeout(() => {
                assert.strictEqual(binders.length, 3, "pass 2 length");

                // Pass 3 - hoist child1 to root
                root.setAttribute("data-layout", "type: stack-panel");
                window.setTimeout(() => {
                    assert.strictEqual(binders.length, 1, "pass 3 length");

                    syncer.stop();
                    done();
                }, 1);
            }, 1);
        }, 1);
    });
}