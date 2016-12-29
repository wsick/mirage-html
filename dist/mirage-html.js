var mirage;
(function (mirage) {
    var html;
    (function (html) {
        html.version = '0.1.0';
    })(html = mirage.html || (mirage.html = {}));
})(mirage || (mirage = {}));
var mirage;
(function (mirage) {
    var html;
    (function (html) {
        var sync;
        (function (sync) {
            function NewDOMMonitor(target, onNodeAdded, onNodeRemoved) {
                function nodeHasLayoutAttr(node) {
                    return !!node.getAttribute("data-layout");
                }
                function addElement(node, parent) {
                    if (node.nodeType !== node.ELEMENT_NODE)
                        return;
                    if (!nodeHasLayoutAttr(node))
                        return;
                    onNodeAdded(node, parent);
                }
                function removeElement(node, parent) {
                    if (node.nodeType !== node.ELEMENT_NODE)
                        return;
                    if (!nodeHasLayoutAttr(node))
                        return;
                    onNodeRemoved(node, parent);
                }
                var observer = new MutationObserver(function (mutations) {
                    for (var i = 0; i < mutations.length; i++) {
                        var mutation = mutations[i];
                        if (mutation.type === "childList") {
                            for (var j = 0; j < mutation.addedNodes.length; j++) {
                                addElement(mutation.addedNodes[j], mutation.target);
                            }
                            for (var j = 0; j < mutation.removedNodes.length; j++) {
                                removeElement(mutation.removedNodes[j], mutation.target);
                            }
                        }
                        else if (mutation.type === "attributes") {
                            if (!mutation.oldValue) {
                                if (nodeHasLayoutAttr(mutation.target)) {
                                    addElement(mutation.target, mutation.target.parentElement);
                                }
                            }
                            else {
                                if (!nodeHasLayoutAttr(mutation.target)) {
                                    removeElement(mutation.target, mutation.target.parentElement);
                                }
                            }
                        }
                    }
                });
                return {
                    start: function () {
                        observer.observe(target, {
                            childList: true,
                            subtree: true,
                            attributes: true,
                            attributeOldValue: true,
                            attributeFilter: ["data-layout"],
                        });
                    },
                    stop: function () {
                        observer.disconnect();
                    },
                };
            }
            sync.NewDOMMonitor = NewDOMMonitor;
        })(sync = html.sync || (html.sync = {}));
    })(html = mirage.html || (mirage.html = {}));
})(mirage || (mirage = {}));

//# sourceMappingURL=mirage-html.js.map
