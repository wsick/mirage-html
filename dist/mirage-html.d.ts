declare module mirage.html {
    var version: string;
}
declare namespace mirage.html.sync {
    interface IDOMMonitor {
        start(): any;
        stop(): any;
    }
    function NewDOMMonitor(target: Node, onNodeAdded: (node: Node, parent: Node) => void, onNodeRemoved: (node: Node, parent: Node) => void): IDOMMonitor;
}
