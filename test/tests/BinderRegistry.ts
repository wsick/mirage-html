namespace mirage.html.tests {
    QUnit.module("BinderRegistry");

    function createMirageElement(tree: ITreeTracker, id: string, layout: string): HTMLDivElement {
        var el = document.createElement('div');
        el.id = id;
        el.setAttribute("data-layout", layout);
        var node = new Panel();
        tree.add(el, node);
        return el;
    }

    function attachMirageNode(tree: ITreeTracker, parentEl: Element, el: Element) {
        var parentNode = tree.getNodeByElement(parentEl);
        var node = tree.getNodeByElement(el);
        node.setParent(parentNode);
    }

    QUnit.test("update", (assert) => {
        var tree = NewTreeTracker();
        var binders: IBinder[] = [];
        var registry = NewBinderRegistry(tree, binders);

        var testRoot = document.createElement('div');
        testRoot.id = "BinderRegistry-root1";
        document.body.appendChild(testRoot);

        var root = createMirageElement(tree, "root", "type: stack-panel");
        var rootNode = tree.getNodeByElement(root);

        var child1 = createMirageElement(tree, "child1", "type: none");
        var childNode1 = tree.getNodeByElement(child1);
        var gchild1 = createMirageElement(tree, "gchild1", "type: none");
        var gchildNode1 = tree.getNodeByElement(gchild1);
        attachMirageNode(tree, child1, gchild1);
        attachMirageNode(tree, root, child1);
        child1.appendChild(gchild1);
        root.appendChild(child1);

        var child2 = createMirageElement(tree, "child2", "type: none");
        var childNode2 = tree.getNodeByElement(child2);
        attachMirageNode(tree, root, child2);
        root.appendChild(child2);

        var child3 = createMirageElement(tree, "child3", "type: none");
        var childNode3 = tree.getNodeByElement(child3);
        attachMirageNode(tree, root, child3);
        root.appendChild(child3);


        // Pass 1 update - add 1 root
        testRoot.appendChild(root);
        registry.update([rootNode], []);
        assert.strictEqual(binders.length, 1, "pass 1 length");
        assert.strictEqual(binders[0].getRoot(), rootNode, "pass 1 - binder 1");

        // Pass 2 update - untag root
        root.removeAttribute("data-layout");
        tree.removeElement(root);
        registry.update([childNode1, childNode2, childNode3], [rootNode]);
        assert.strictEqual(binders.length, 3, "pass 2 length");
        assert.strictEqual(binders[0].getRoot(), childNode1, "pass 2 - binder 1");
        assert.strictEqual(binders[1].getRoot(), childNode2, "pass 2 - binder 2");
        assert.strictEqual(binders[2].getRoot(), childNode3, "pass 2 - binder 3");

        // Pass 3 update - hoist child1 to root
        root.setAttribute("data-layout", "type: stack-panel");
        tree.add(root, rootNode);
        registry.update([rootNode], [childNode2, childNode3]);
        assert.strictEqual(binders.length, 1, "pass 3 length");
        assert.strictEqual(binders[0].getRoot(), rootNode, "pass 3 - binder 1");
    });
}