namespace mirage.html.tests {
    QUnit.module("DOMMonitor");

    QUnit.test("add+remove", (assert) => {
        var done = assert.async();

        var monitorRoot = document.createElement('div');
        monitorRoot.id = "DOMMonitor-root1";
        document.body.appendChild(monitorRoot);
        var added: Element[] = [];
        var removed: Element[] = [];
        var monitor = NewDOMMonitor(monitorRoot,
            (newEls, oldEls, untagged, changed) => {
                added = added.concat(newEls);
                removed = removed.concat(oldEls);
            });
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
        monitorRoot.id = "DOMMonitor-root2";
        document.body.appendChild(monitorRoot);
        var added: Element[] = [];
        var removed: Element[] = [];
        var monitor = NewDOMMonitor(monitorRoot,
            (newEls, oldEls, untagged, changed) => {
                added = added.concat(newEls);
                removed = removed.concat(oldEls);
            });
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

    QUnit.test("data-layout-changed", (assert) => {
        var done = assert.async();

        var monitorRoot = document.createElement('div');
        monitorRoot.id = "DOMMonitor-root3";
        document.body.appendChild(monitorRoot);
        var changes: IDataLayoutChange[] = [];
        var monitor = NewDOMMonitor(monitorRoot,
            (newEls, oldEls, untagged, changed) => {
                changes = changes.concat(changed);
            });
        monitor.start();

        var el1 = document.createElement('div');
        el1.setAttribute("data-layout", "type: panel;");
        monitorRoot.appendChild(el1);

        window.setTimeout(() => {
            // now that the node is added, we can alter the attribute
            el1.setAttribute("data-layout", "type: stack-panel;");
            window.setTimeout(() => {
                monitor.stop();

                assert.strictEqual(changes.length, 1, "1 change");
                assert.strictEqual(changes[0].oldValue, "type: panel;", "change 0 old value");
                assert.strictEqual(changes[0].target, el1, "change 0 target");

                done();
            }, 1);
        }, 1);
    });
}