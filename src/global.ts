namespace mirage {
    var orchestrator: html.IOrchestrator;

    export function watchDOM(target?: Node) {
        target = target || document.body;
        orchestrator = html.NewOrchestrator(target);
        orchestrator.start();
    }

    export function getRoots(): core.LayoutNode[] {
        return orchestrator.binders.map(binder => binder.getRoot());
    }

    export function getLayoutNode(obj: Element | string): core.LayoutNode {
        let el: Element;
        if (typeof obj === "string") {
            el = document.getElementById(obj);
        } else {
            el = obj;
        }
        return el ? orchestrator.tree.getNodeByElement(el) : null;
    }
}