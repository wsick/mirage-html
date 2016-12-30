namespace mirage.html.tests {
    QUnit.module("PanelInserter");

    QUnit.test("all-new", (assert) => {
        var testRoot = document.createElement('div');
        testRoot.id = "PanelInserter-root1";
        document.body.appendChild(testRoot);

        var children: Element[] = [
            document.createElement('div'),
            document.createElement('div'),
            document.createElement('div'),
            document.createElement('div'),
            document.createElement('div')
        ];
        var childNodes: core.LayoutNode[] = [
            new core.LayoutNode(),
            new core.LayoutNode(),
            new core.LayoutNode(),
            new core.LayoutNode(),
            new core.LayoutNode(),
        ];

        var root = document.createElement('div');
        root.appendChild(children[0]);
        root.appendChild(children[1]);
        root.appendChild(children[2]);
        root.appendChild(children[3]);
        root.appendChild(children[4]);
        testRoot.appendChild(root);


        var inserter = NewPanelInserter();
        var panel = new Panel();

        // Run inserter pass
        inserter.add(panel, children[1], childNodes[1]);
        inserter.add(panel, children[2], childNodes[2]);
        inserter.add(panel, children[0], childNodes[0]);
        inserter.add(panel, children[4], childNodes[4]);
        inserter.add(panel, children[3], childNodes[3]);
        inserter.commit();

        for (let i = 0; i < panel.childCount; i++) {
            assert.strictEqual(panel.getChildAt(i), childNodes[i], `panel child ${i}`);
        }
    });

    QUnit.test("partial-update", (assert) => {
        var testRoot = document.createElement('div');
        testRoot.id = "PanelInserter-root2";
        document.body.appendChild(testRoot);

        var children: Element[] = [
            document.createElement('div'),
            document.createElement('div'),
            document.createElement('div'),
            document.createElement('div'),
            document.createElement('div')
        ];
        var childNodes: core.LayoutNode[] = [
            new core.LayoutNode(),
            new core.LayoutNode(),
            new core.LayoutNode(),
            new core.LayoutNode(),
            new core.LayoutNode(),
        ];

        var root = document.createElement('div');
        root.appendChild(children[0]);
        root.appendChild(children[1]);
        root.appendChild(children[2]);
        root.appendChild(children[3]);
        root.appendChild(children[4]);
        testRoot.appendChild(root);


        var inserter = NewPanelInserter();
        var panel = new Panel();

        // Pre-seed panel with 1,4
        panel.appendChild(childNodes[0]);
        panel.appendChild(childNodes[3]);

        // Run inserter pass
        inserter.add(panel, children[4], childNodes[4]);
        inserter.add(panel, children[1], childNodes[1]);
        inserter.add(panel, children[2], childNodes[2]);
        inserter.commit();

        for (let i = 0; i < panel.childCount; i++) {
            assert.strictEqual(panel.getChildAt(i), childNodes[i], `panel child ${i}`);
        }
    });
}