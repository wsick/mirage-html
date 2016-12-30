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
        function NewBinder(tree) {
            var root;
            var element;
            var drafter;
            var lastDraftSize = new mirage.Size(NaN, NaN);
            var updater = {
                updateSlots: function (updates) {
                    for (var i = 0; i < updates.length; i++) {
                        var update = updates[i];
                        var el = tree.getElementByNode(update.node);
                    }
                },
            };
            function getElementSize(el) {
                return new mirage.Size(el.scrollWidth, el.scrollHeight);
            }
            return {
                getRoot: function () {
                    return root;
                },
                setRoot: function (node) {
                    mirage.Size.undef(lastDraftSize);
                    root = node;
                    if (!node) {
                        element = null;
                        drafter = null;
                    }
                    else {
                        element = tree.getElementByNode(root);
                        drafter = mirage.draft.NewDrafter(root);
                    }
                },
                run: function () {
                    var rootSize = getElementSize(element);
                    if (!mirage.Size.isEqual(lastDraftSize, rootSize)) {
                        drafter(updater, rootSize);
                        mirage.Size.copyTo(rootSize, lastDraftSize);
                    }
                },
            };
        }
        html.NewBinder = NewBinder;
    })(html = mirage.html || (mirage.html = {}));
})(mirage || (mirage = {}));
var mirage;
(function (mirage) {
    var html;
    (function (html) {
        function NewBinderRegistry(tree, binders) {
            var roots = [];
            binders = binders || [];
            function findHoistCandidate(binder) {
                var curRoot = binder.getRoot();
                if (!curRoot)
                    return null;
                var newRoot = curRoot;
                while (newRoot.tree.parent) {
                    newRoot = newRoot.tree.parent;
                }
                if (newRoot === curRoot)
                    return null;
                if (roots.indexOf(newRoot) > -1)
                    return null;
                return newRoot;
            }
            function hoist(addedRoots) {
                var missingBinderNodes = addedRoots.slice(0);
                for (var i = 0; i < binders.length; i++) {
                    var binder = binders[i];
                    var newRoot = findHoistCandidate(binder);
                    if (!newRoot) {
                        binders.splice(i, 1);
                        i--;
                        continue;
                    }
                    binder.setRoot(newRoot);
                    roots.push(newRoot);
                    var missingIndex = missingBinderNodes.indexOf(newRoot);
                    if (missingIndex > -1) {
                        missingBinderNodes.splice(missingIndex, 1);
                    }
                }
                return missingBinderNodes;
            }
            function create(nodes) {
                for (var i = 0; i < nodes.length; i++) {
                    var node = nodes[i];
                    var binder = html.NewBinder(tree);
                    binder.setRoot(node);
                    roots.push(node);
                    binders.push(binder);
                }
            }
            function adjustDestroyed(destroyedRoots) {
                for (var i = 0; i < binders.length; i++) {
                    var binder = binders[i];
                    var curRoot = binder.getRoot();
                    var index = destroyedRoots.indexOf(curRoot);
                    if (index > -1) {
                        binders.splice(index, 1);
                        i--;
                        binder.setRoot(null);
                        var trackIndex = roots.indexOf(curRoot);
                        if (trackIndex > -1)
                            roots.splice(trackIndex, 1);
                    }
                }
            }
            return {
                update: function (addedRoots, destroyedRoots) {
                    var missingBinderNodes = hoist(addedRoots);
                    create(missingBinderNodes);
                    adjustDestroyed(destroyedRoots);
                },
            };
        }
        html.NewBinderRegistry = NewBinderRegistry;
    })(html = mirage.html || (mirage.html = {}));
})(mirage || (mirage = {}));
var mirage;
(function (mirage) {
    var html;
    (function (html) {
        function isMirageElement(node) {
            return node.nodeType === node.ELEMENT_NODE
                && !!node.getAttribute("data-layout");
        }
        html.isMirageElement = isMirageElement;
        function NewDOMMonitor(target, onUpdate) {
            var observer = new MutationObserver(function (mutations) {
                var added = [];
                var removed = [];
                var untagged = [];
                for (var i = 0; i < mutations.length; i++) {
                    var mutation = mutations[i];
                    if (mutation.type === "childList") {
                        for (var j = 0; j < mutation.addedNodes.length; j++) {
                            var el = mutation.addedNodes[j];
                            if (isMirageElement(el)) {
                                added.push(el);
                            }
                        }
                        for (var j = 0; j < mutation.removedNodes.length; j++) {
                            var el = mutation.removedNodes[j];
                            if (isMirageElement(el)) {
                                removed.push(el);
                            }
                        }
                    }
                    else if (mutation.type === "attributes") {
                        if (!mutation.oldValue) {
                            if (isMirageElement(mutation.target)) {
                                added.push(mutation.target);
                            }
                        }
                        else {
                            if (!isMirageElement(mutation.target)) {
                                untagged.push(mutation.target);
                            }
                        }
                    }
                }
                if (added.length > 0 || removed.length > 0 || untagged.length > 0) {
                    onUpdate(added, removed, untagged);
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
        html.NewDOMMonitor = NewDOMMonitor;
    })(html = mirage.html || (mirage.html = {}));
})(mirage || (mirage = {}));
var mirage;
(function (mirage) {
    var html;
    (function (html) {
        function NewPanelInserter() {
            var items = [];
            return {
                add: function (panel, el, node) {
                    var item = panel.getAttached("html-sync-escrow");
                    if (!item) {
                        item = {
                            panel: panel,
                            entries: [],
                        };
                        panel.setAttached("html-sync-escrow", item);
                        items.push(item);
                    }
                    item.entries.push({
                        node: node,
                        index: Array.prototype.indexOf.call(el.parentElement.children, el),
                    });
                },
                commit: function () {
                    for (var i = 0; i < items.length; i++) {
                        var item = items[i];
                        var panel = item.panel;
                        var entries = item.entries;
                        panel.setAttached("html-sync-escrow", undefined);
                        entries.sort(function (a, b) { return a.index - b.index; });
                        for (var j = 0; j < entries.length; j++) {
                            panel.insertChild(entries[j].node, entries[j].index);
                        }
                    }
                },
            };
        }
        html.NewPanelInserter = NewPanelInserter;
    })(html = mirage.html || (mirage.html = {}));
})(mirage || (mirage = {}));
var mirage;
(function (mirage) {
    var html;
    (function (html) {
        function NewTreeSynchronizer(target, tree, registry) {
            tree = tree || html.NewTreeTracker();
            registry = registry || html.NewBinderRegistry(tree);
            function mirrorAdded(added) {
                for (var i = 0; i < added.length; i++) {
                    register(added[i]);
                }
            }
            function mirrorUntagged(untagged, addedRoots, destroyedRoots) {
                for (var i = 0; i < untagged.length; i++) {
                    deregister(untagged[i], true, addedRoots, destroyedRoots);
                }
            }
            function mirrorRemoved(removed, addedRoots, destroyedRoots) {
                for (var i = 0; i < removed.length; i++) {
                    deregister(removed[i], false, addedRoots, destroyedRoots);
                }
            }
            function register(el) {
                if (tree.elementExists(el) || !html.isMirageElement(el))
                    return;
                var node = mirage.createNodeByType("...");
                tree.add(el, node);
                for (var cur = el.firstElementChild; !!cur; cur = cur.nextElementSibling) {
                    register(cur);
                }
            }
            function deregister(el, isUntagged, addedRoots, destroyedRoots) {
                var node = tree.removeElement(el);
                if (!node)
                    return;
                if (!isUntagged) {
                    for (var cur = el.firstElementChild; !!cur; cur = cur.nextElementSibling) {
                        deregister(cur, true, null, null);
                    }
                }
                var parentNode = node.tree.parent;
                if (!parentNode) {
                    destroyedRoots.push(node);
                    promoteChildren(el, addedRoots);
                }
                if (parentNode instanceof mirage.Panel) {
                    parentNode.removeChild(node);
                }
                else {
                    node.setParent(null);
                }
            }
            function promoteChildren(el, addedRoots) {
                for (var cur = el.firstElementChild; !!cur; cur = cur.nextElementSibling) {
                    if (html.isMirageElement(cur)) {
                        addedRoots.push(tree.getNodeByElement(cur));
                    }
                    else {
                        promoteChildren(cur, addedRoots);
                    }
                }
            }
            function mirrorAncestry(added, addedRoots, inserter) {
                for (var i = 0; i < added.length; i++) {
                    var el = added[i];
                    var node = tree.getNodeByElement(el);
                    if (!node)
                        continue;
                    var parentNode = (el.parentElement ? tree.getNodeByElement(el.parentElement) : null) || null;
                    if (parentNode instanceof mirage.Panel) {
                        inserter.add(parentNode, el, node);
                    }
                    else {
                        node.setParent(parentNode);
                    }
                    if (!node.tree.parent) {
                        addedRoots.push(node);
                    }
                    configAncestors(el, node, inserter);
                }
            }
            function configAncestors(parentEl, parentNode, inserter) {
                for (var cur = parentEl.firstElementChild, i = 0; !!cur; cur = cur.nextElementSibling, i++) {
                    var curNode = tree.getNodeByElement(cur);
                    if (curNode && !curNode.tree.parent) {
                        if (parentNode instanceof mirage.Panel) {
                            inserter.add(parentNode, cur, curNode);
                        }
                        else {
                            curNode.setParent(parentNode);
                        }
                        configAncestors(cur, curNode, inserter);
                    }
                }
            }
            function update(added, removed, untagged) {
                var inserter = html.NewPanelInserter();
                var addedRoots = [];
                var destroyedRoots = [];
                mirrorAdded(added);
                mirrorUntagged(untagged, addedRoots, destroyedRoots);
                mirrorRemoved(removed, addedRoots, destroyedRoots);
                mirrorAncestry(added, addedRoots, inserter);
                inserter.commit();
                registry.update(addedRoots, destroyedRoots);
            }
            var monitor = html.NewDOMMonitor(target, update);
            return {
                start: function () {
                    monitor.start();
                },
                stop: function () {
                    monitor.stop();
                },
            };
        }
        html.NewTreeSynchronizer = NewTreeSynchronizer;
    })(html = mirage.html || (mirage.html = {}));
})(mirage || (mirage = {}));
var mirage;
(function (mirage) {
    var html;
    (function (html) {
        var XMLNS = "http://schemas.wsick.com/mirage/html";
        function NewTreeTracker() {
            var elements = {};
            var nodes = {};
            var lastUid = 0;
            return {
                add: function (el, node) {
                    lastUid++;
                    var uid = lastUid.toString();
                    el.setAttributeNS(XMLNS, "uid", uid);
                    node.setAttached("mirage-uid", uid);
                    elements[uid] = el;
                    nodes[uid] = node;
                    return uid;
                },
                removeElement: function (el) {
                    var uid = el.getAttributeNS(XMLNS, "uid");
                    var node = !uid ? null : nodes[uid];
                    el.removeAttributeNS(XMLNS, "uid");
                    if (node) {
                        node.setAttached("mirage-uid", undefined);
                        delete elements[uid];
                        delete nodes[uid];
                    }
                    return node;
                },
                elementExists: function (el) {
                    var uid = el.getAttributeNS(XMLNS, "uid");
                    return elements[uid] === el;
                },
                getNodeByElement: function (el) {
                    var uid = el.getAttributeNS(XMLNS, "uid");
                    return nodes[uid];
                },
                getElementByNode: function (node) {
                    var uid = node.getAttached("mirage-uid");
                    return elements[uid];
                },
            };
        }
        html.NewTreeTracker = NewTreeTracker;
        function getNodeUid(node) {
            return node.getAttached("mirage-uid");
        }
        html.getNodeUid = getNodeUid;
    })(html = mirage.html || (mirage.html = {}));
})(mirage || (mirage = {}));

//# sourceMappingURL=mirage-html.js.map
