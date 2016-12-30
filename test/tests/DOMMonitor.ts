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
            (newEls, oldEls) => {
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
            (newEls, oldEls) => {
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
}