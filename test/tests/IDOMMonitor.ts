namespace mirage.html.tests {
    QUnit.module("IDOMMonitor");

    QUnit.test("add+remove", (assert) => {
        var done = assert.async();

        var monitorRoot = document.createElement('div');
        monitorRoot.id = "IDOMMonitor-root1";
        document.body.appendChild(monitorRoot);
        var added: Node[] = [];
        var removed: Node[] = [];
        var monitor = NewDOMMonitor(monitorRoot,
            (node, parent) => added.push(node),
            (node, parent) => removed.push(node));
        monitor.start();

        var nonMirageNode1 = document.createElement('div');
        monitorRoot.appendChild(nonMirageNode1);
        var mirageNode1 = document.createElement('div');
        mirageNode1.setAttribute("data-layout", "type: none");
        monitorRoot.appendChild(mirageNode1);

        window.setTimeout(() => {
            assert.strictEqual(added.length, 1, "1 added");
            assert.ok(added.indexOf(mirageNode1) > -1, "added node1");

            monitorRoot.removeChild(mirageNode1);
            window.setTimeout(() => {
                monitor.stop();

                assert.strictEqual(removed.length, 1, "1 removed");
                assert.ok(removed.indexOf(mirageNode1) > -1, "removed node1");

                done();
            }, 1);
        }, 1);
    });

    QUnit.test("register-after-add", (assert) => {
        var done = assert.async();

        var monitorRoot = document.createElement('div');
        monitorRoot.id = "IDOMMonitor-root2";
        document.body.appendChild(monitorRoot);
        var added: Node[] = [];
        var removed: Node[] = [];
        var monitor = NewDOMMonitor(monitorRoot,
            (node, parent) => added.push(node),
            (node, parent) => removed.push(node));
        monitor.start();

        var lateNode1 = document.createElement('div');
        monitorRoot.appendChild(lateNode1);

        window.setTimeout(() => {
            assert.strictEqual(added.length, 0, "none added yet");

            lateNode1.setAttribute("data-layout", "type: none");
            window.setTimeout(() => {
                monitor.stop();

                assert.strictEqual(added.length, 1, "1 added");
                assert.ok(added.indexOf(lateNode1) > -1, "added late");

                done();
            }, 1);
        }, 1);
    });
}