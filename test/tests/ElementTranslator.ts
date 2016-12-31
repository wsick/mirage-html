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
}