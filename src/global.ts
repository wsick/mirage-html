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

    export function dumpLayoutTree(root: core.LayoutNode, indent?: string): string {
        let s = "";
        if (!indent) {
            s += "\n";
            indent = "";
        }
        let ctor = root.constructor;
        s += indent + (<any>ctor).name.toString() + "\n";
        for (let walker = root.tree.walk(); walker.step();) {
            s += dumpLayoutTree(walker.current, indent + "  ");
        }
        return s;
    }
}