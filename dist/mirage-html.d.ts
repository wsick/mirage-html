declare module mirage.html {
    var version: string;
}
declare namespace mirage.html {
    interface IAnimClock {
        enable(): any;
        disable(): any;
    }
    interface IAnimFrame {
        (now: number, delta: number): void;
    }
    function NewAnimClock(onFrame: IAnimFrame): IAnimClock;
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
        (added: Element[], removed: Element[], untagged: Element[], changed: IDataLayoutChange[]): void;
    }
    interface IDataLayoutChange {
        target: Element;
        oldValue: string;
    }
    function isMirageElement(node: Node): boolean;
    function NewDOMMonitor(target: Node, onUpdate: INodeMonitorUpdate): IDOMMonitor;
}
declare namespace mirage.html {
    function NewDraftUpdater(tree: ITreeTracker): mirage.draft.IDraftUpdater;
}
declare namespace mirage.html {
    interface IElementTranslator {
        translateNew(el: Element): core.LayoutNode;
        translateChange(el: Element, node: core.LayoutNode, oldDataLayout: string): core.LayoutNode;
    }
    function NewElementTranslator(): IElementTranslator;
}
declare namespace mirage.html {
    function watch(target?: Node): void;
    function getRoots(): core.LayoutNode[];
    function getLayoutNode(obj: Element | string): core.LayoutNode;
    function dumpLayoutTree(root: core.LayoutNode, indent?: string): string;
    function enableLogging(): void;
}
declare namespace mirage.html {
    class HtmlNode extends core.LayoutNode {
        static getElement(node: core.LayoutNode): HTMLElement;
        static setElement(node: core.LayoutNode, el: HTMLElement): void;
        protected measureOverride(constraint: ISize): ISize;
        protected arrangeOverride(arrangeSize: ISize): ISize;
        static isDummyElement(el: Node): boolean;
    }
}
declare namespace mirage.html {
    interface IOrchestrator {
        tree: ITreeTracker;
        binders: IBinder[];
        registry: IBinderRegistry;
        sync: ITreeSynchronizer;
        start(): any;
        stop(): any;
    }
    function NewOrchestrator(target: Node): IOrchestrator;
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
        start(initialize: boolean): any;
        stop(): any;
    }
    function NewTreeSynchronizer(target: Node, tree?: ITreeTracker, registry?: IBinderRegistry, translator?: IElementTranslator): ITreeSynchronizer;
}
declare namespace mirage.html {
    interface ITreeTracker {
        add(el: Element, node: core.LayoutNode): string;
        replaceNode(oldNode: core.LayoutNode, newNode: core.LayoutNode): string;
        removeElement(el: Element): core.LayoutNode;
        elementExists(el: Element): boolean;
        getNodeByElement(el: Element): core.LayoutNode;
        getElementByNode(node: core.LayoutNode): Element;
    }
    function NewTreeTracker(): ITreeTracker;
    function getNodeUid(node: core.LayoutNode): string;
}
