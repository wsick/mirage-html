namespace mirage.html.tests {
    QUnit.module("ElementTranslator");

    QUnit.test("translateNew", (assert) => {
        let translator = NewElementTranslator();

        let el = document.createElement('div');
        el.setAttribute("data-layout", "type: stack-panel;  orientation  : vertical; grid.row: 1; ");
        let node = translator.translateNew(el);
        assert.ok(node instanceof StackPanel, "type");
        assert.strictEqual((<StackPanel>node).orientation, Orientation.vertical, "orientation");
        assert.strictEqual(Grid.getRow(node), 1, "grid.row");
    });

    QUnit.test("translateChange-simple", (assert) => {
        let translator = NewElementTranslator();

        let el = document.createElement('div');
        let original = "type: stack-panel;  orientation  : vertical; grid.row: 1; ";
        el.setAttribute("data-layout", original);
        let node = translator.translateNew(el);

        el.setAttribute("data-layout", "type: stack-panel; vertical-alignment: center;");
        let changeNode = translator.translateChange(el, node, original);
        assert.strictEqual(node, changeNode, "type unchanged");
        assert.strictEqual((<StackPanel>node).orientation, Orientation.horizontal, "orientation reset");
        assert.ok(!Grid.getRow(node), "grid.row reset");
        assert.strictEqual(node.verticalAlignment, VerticalAlignment.center, "vertical-alignment set");
    });

    QUnit.test("translateChange-new-node", (assert) => {
        let translator = NewElementTranslator();

        let el = document.createElement('div');
        let original = "type: stack-panel;";
        el.setAttribute("data-layout", original);
        let node = translator.translateNew(el);

        el.setAttribute("data-layout", "type: grid;");
        let changeNode = translator.translateChange(el, node, original);
        assert.notStrictEqual(node, changeNode, "type changed");
    });

    QUnit.test("translateChange-unset", (assert) => {
        let translator = NewElementTranslator();

        let el = document.createElement('div');
        let original = "type: stack-panel;";
        el.setAttribute("data-layout", original);
        let node = translator.translateNew(el);

        el.setAttribute("data-layout", "grid.row: 1;");
        let changeNode = translator.translateChange(el, node, original);
        assert.ok(!changeNode, "type cleared");
    });
}