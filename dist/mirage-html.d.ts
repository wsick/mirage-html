declare module mirage.html {
    var version: string;
}
declare namespace mirage.html {
    interface IBinder {
        getRoot(): core.LayoutNode;
        setRoot(node: core.LayoutNode): any;
        run(): any;
    }
    function NewBinder(tree: ITreeTracker): IBinder;
}
declare namespace mirage.html {
    interface IBinderRegistry {
        update(addedRoots: core.LayoutNode[], destroyedRoots: core.LayoutNode[]): any;
    }
    function NewBinderRegistry(tree: ITreeTracker, binders?: IBinder[]): IBinderRegistry;
}
declare namespace mirage.html {
    interface IDOMMonitor {
        start(): any;
        stop(): any;
    }
    interface INodeMonitorUpdate {
        (added: Element[], removed: Element[], untagged: Element[]): void;
    }
    function isMirageElement(node: Node): boolean;
    function NewDOMMonitor(target: Node, onUpdate: INodeMonitorUpdate): IDOMMonitor;
}
declare namespace mirage.html {
    interface IPanelInserter {
        add(panel: Panel, el: Element, node: core.LayoutNode): any;
        commit(): any;
    }
    function NewPanelInserter(): IPanelInserter;
}
declare namespace mirage.html {
    interface ITreeSynchronizer {
        start(): any;
        stop(): any;
    }
    function NewTreeSynchronizer(target: Node, tree?: ITreeTracker, registry?: IBinderRegistry): ITreeSynchronizer;
}
declare namespace mirage.html {
    interface ITreeTracker {
        add(el: Element, node: core.LayoutNode): string;
        removeElement(el: Element): any;
        elementExists(el: Element): boolean;
        getNodeByElement(el: Element): core.LayoutNode;
        getElementByNode(node: core.LayoutNode): Element;
    }
    function NewTreeTracker(): ITreeTracker;
    function getNodeUid(node: core.LayoutNode): string;
}
