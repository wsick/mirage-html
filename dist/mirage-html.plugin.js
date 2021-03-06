var mirage;
(function (mirage) {
    var html;
    (function (html) {
        html.version = '0.1.1';
    })(html = mirage.html || (mirage.html = {}));
})(mirage || (mirage = {}));
var mirage;
(function (mirage) {
    var html;
    (function (html) {
        function NewAnimClock(onFrame) {
            var enabled = false;
            var last = NaN;
            function tick(now) {
                if (!enabled)
                    return;
                onFrame(now, isNaN(last) ? 0 : now - last);
                last = now;
                if (enabled)
                    window.requestAnimationFrame(tick);
            }
            return {
                enable: function () {
                    enabled = true;
                    window.requestAnimationFrame(tick);
                },
                disable: function () {
                    enabled = false;
                    last = NaN;
                },
            };
        }
        html.NewAnimClock = NewAnimClock;
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
            var updater = html.NewDraftUpdater(tree);
            var lastDraftSize = new mirage.Size(NaN, NaN);
            function getRootSize() {
                var htmlHeight = root.getAttached("html.height");
                if (htmlHeight === "window")
                    return new mirage.Size(window.innerWidth, window.innerHeight - 20);
                if (htmlHeight === "infinite")
                    return new mirage.Size(window.innerWidth, Number.POSITIVE_INFINITY);
                return new mirage.Size(element.scrollWidth, element.scrollHeight);
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
                    var rootSize = getRootSize();
                    if (!mirage.Size.isEqual(lastDraftSize, rootSize)) {
                        root.invalidateMeasure();
                        mirage.Size.copyTo(rootSize, lastDraftSize);
                    }
                    if ((root.state.flags & mirage.core.LayoutFlags.hints) > 0) {
                        drafter(updater, rootSize);
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
            function hoist(addedRoots, destroyedRoots) {
                for (var i = 0; i < binders.length; i++) {
                    var binder = binders[i];
                    var curRoot = binder.getRoot();
                    if (!curRoot) {
                        binders.splice(i, 1);
                        i--;
                        continue;
                    }
                    var newRoot = findRoot(curRoot);
                    if (curRoot !== newRoot) {
                        replaceBinderRoot(binder, curRoot, newRoot, destroyedRoots);
                    }
                    var existingIndex = addedRoots.indexOf(newRoot);
                    if (existingIndex > -1)
                        addedRoots.splice(i, 1);
                }
            }
            function findRoot(curRoot) {
                var newRoot = curRoot;
                while (newRoot.tree.parent) {
                    newRoot = newRoot.tree.parent;
                }
                return newRoot;
            }
            function replaceBinderRoot(binder, curRoot, newRoot, destroyedRoots) {
                // Replace this binder's root with newRoot
                if (roots.indexOf(newRoot) > -1) {
                    destroyedRoots.push(curRoot);
                    return;
                }
                var oldIndex = roots.indexOf(curRoot);
                if (oldIndex > -1)
                    roots.splice(oldIndex, 1);
                binder.setRoot(newRoot);
                roots.push(newRoot);
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
            function destroy(destroyedRoots) {
                for (var i = 0; i < binders.length; i++) {
                    var index = destroyedRoots.indexOf(binders[i].getRoot());
                    if (index > -1) {
                        destroyBinder(i);
                        i--;
                    }
                }
            }
            function destroyBinder(index) {
                var binder = binders.splice(index, 1)[0];
                var curRoot = binder.getRoot();
                binder.setRoot(null);
                if (curRoot) {
                    var trackIndex = roots.indexOf(curRoot);
                    if (trackIndex > -1)
                        roots.splice(trackIndex, 1);
                }
            }
            return {
                update: function (addedRoots, destroyedRoots) {
                    hoist(addedRoots, destroyedRoots);
                    create(addedRoots);
                    destroy(destroyedRoots);
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
                var changed = [];
                var needsUpdate = false;
                for (var i = 0; i < mutations.length; i++) {
                    var mutation = mutations[i];
                    if (html.HtmlNode.isDummyElement(mutation.target))
                        continue;
                    if (mutation.type === "childList") {
                        for (var j = 0; j < mutation.addedNodes.length; j++) {
                            var el = mutation.addedNodes[j];
                            if (isMirageElement(el)) {
                                added.push(el);
                                needsUpdate = true;
                            }
                        }
                        for (var j = 0; j < mutation.removedNodes.length; j++) {
                            var el = mutation.removedNodes[j];
                            if (isMirageElement(el)) {
                                removed.push(el);
                                needsUpdate = true;
                            }
                        }
                    }
                    else if (mutation.type === "attributes") {
                        if (!mutation.oldValue) {
                            if (isMirageElement(mutation.target)) {
                                added.push(mutation.target);
                                needsUpdate = true;
                            }
                        }
                        else {
                            if (!isMirageElement(mutation.target)) {
                                untagged.push(mutation.target);
                                needsUpdate = true;
                            }
                            else {
                                changed.push({ target: mutation.target, oldValue: mutation.oldValue });
                                needsUpdate = true;
                            }
                        }
                    }
                }
                if (needsUpdate) {
                    onUpdate(added, removed, untagged, changed);
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
        function NewDraftUpdater(tree) {
            function updateSlot(el, slot) {
                el.style.position = "absolute";
                el.style.left = slot.x + "px";
                el.style.top = slot.y + "px";
                el.style.width = slot.width + "px";
                el.style.height = slot.height + "px";
                el.style.boxSizing = "border-box";
            }
            return {
                updateSlots: function (updates) {
                    for (var i = 0; i < updates.length; i++) {
                        var update = updates[i];
                        var node = update.node;
                        var el = tree.getElementByNode(update.node);
                        el.style.display = "none";
                        if (node.tree.parent)
                            updateSlot(tree.getElementByNode(update.node), update.newRect);
                        el.style.display = "";
                    }
                },
            };
        }
        html.NewDraftUpdater = NewDraftUpdater;
    })(html = mirage.html || (mirage.html = {}));
})(mirage || (mirage = {}));
var mirage;
(function (mirage) {
    var html;
    (function (html) {
        function NewElementTranslator() {
            function parseDataLayout(dataLayout) {
                var hash = {};
                for (var tokens = dataLayout.split(";"), i = 0; i < tokens.length; i++) {
                    var token = tokens[i];
                    var index = token.indexOf(':');
                    if (index < 0)
                        continue;
                    hash[token.substr(0, index).trim()] = token.substr(index + 1).trim();
                }
                return hash;
            }
            function applyHash(node, hash) {
                for (var keys = Object.keys(hash), i = 0; i < keys.length; i++) {
                    var key = keys[i];
                    var mapper = mirage.map.getMapper(key);
                    if (mapper)
                        mapper(node, hash[key]);
                }
            }
            return {
                translateNew: function (el) {
                    var hash = parseDataLayout(el.getAttribute("data-layout"));
                    var type = hash["type"];
                    if (!type)
                        return null;
                    var node = mirage.createNodeByType(type);
                    if (type === "html")
                        html.HtmlNode.setElement(node, el);
                    applyHash(node, hash);
                    return node;
                },
                translateChange: function (el, node, oldDataLayout) {
                    var oldHash = parseDataLayout(oldDataLayout);
                    var newHash = parseDataLayout(el.getAttribute("data-layout"));
                    var newType = newHash["type"];
                    if (!newType)
                        return null;
                    if (oldHash["type"] !== newType) {
                        var newNode = mirage.createNodeByType(newType);
                        applyHash(newNode, newHash);
                        return newNode;
                    }
                    var oldKeys = Object.keys(oldHash);
                    var newKeys = Object.keys(newHash);
                    for (var i = 0; i < oldKeys.length; i++) {
                        var key = oldKeys[i];
                        if (newKeys.indexOf(key) > -1)
                            continue;
                        var mapper = mirage.map.getMapper(key);
                        if (mapper)
                            mapper(node, undefined);
                    }
                    applyHash(node, newHash);
                    return node;
                },
            };
        }
        html.NewElementTranslator = NewElementTranslator;
    })(html = mirage.html || (mirage.html = {}));
})(mirage || (mirage = {}));
var mirage;
(function (mirage) {
    var html;
    (function (html) {
        var orchestrator;
        function watch(target) {
            target = target || document.body;
            orchestrator = html.NewOrchestrator(target);
            orchestrator.start();
        }
        html.watch = watch;
        function getRoots() {
            return orchestrator.binders.map(function (binder) { return binder.getRoot(); });
        }
        html.getRoots = getRoots;
        function getLayoutNode(obj) {
            var el;
            if (typeof obj === "string") {
                el = document.getElementById(obj);
            }
            else {
                el = obj;
            }
            return el ? orchestrator.tree.getNodeByElement(el) : null;
        }
        html.getLayoutNode = getLayoutNode;
        function dumpLayoutTree(root, indent) {
            var s = "";
            if (!indent) {
                s += "\n";
                indent = "";
            }
            var ctor = root.constructor;
            s += indent + ctor.name.toString() + "\n";
            for (var walker = root.tree.walk(); walker.step();) {
                s += dumpLayoutTree(walker.current, indent + "  ");
            }
            return s;
        }
        html.dumpLayoutTree = dumpLayoutTree;
        function enableLogging() {
            mirage.logger = mirage.logging.NewConsoleLogger(function (node) {
                var el = orchestrator.tree.getElementByNode(node);
                var id = el && el.id ? "#" + el.id : "";
                var type = node.constructor;
                return "" + type.name + id;
            });
        }
        html.enableLogging = enableLogging;
    })(html = mirage.html || (mirage.html = {}));
})(mirage || (mirage = {}));
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var mirage;
(function (mirage) {
    var html;
    (function (html) {
        var dummy;
        var HtmlNode = (function (_super) {
            __extends(HtmlNode, _super);
            function HtmlNode() {
                _super.apply(this, arguments);
            }
            HtmlNode.getElement = function (node) {
                return node.getAttached("html-element");
            };
            HtmlNode.setElement = function (node, el) {
                node.setAttached("html-element", el);
                node.invalidateMeasure();
            };
            HtmlNode.prototype.measureOverride = function (constraint) {
                var el = HtmlNode.getElement(this);
                return el ? calcElementDesired(el, constraint) : new mirage.Size();
            };
            HtmlNode.prototype.arrangeOverride = function (arrangeSize) {
                return arrangeSize;
            };
            HtmlNode.isDummyElement = function (el) {
                return el === dummy;
            };
            return HtmlNode;
        })(mirage.core.LayoutNode);
        html.HtmlNode = HtmlNode;
        mirage.registerNodeType("html", HtmlNode);
        function calcElementDesired(el, constraint) {
            if (!dummy) {
                dummy = document.createElement('div');
                dummy.id = "mirage-dummy";
                dummy.style.position = "absolute";
                dummy.style.boxSizing = "border-box";
                dummy.style.display = "none";
                document.body.appendChild(dummy);
            }
            dummy.style.width = isFinite(constraint.width) ? constraint.width + "px" : "";
            dummy.style.height = isFinite(constraint.height) ? constraint.height + "px" : "";
            dummy.style.display = "";
            dummy.innerHTML = el.outerHTML;
            var clone = dummy.firstElementChild;
            clone.style.display = "";
            var bounds = clone.getBoundingClientRect();
            dummy.innerHTML = "";
            dummy.style.display = "none";
            return new mirage.Size(bounds.width, bounds.height);
        }
    })(html = mirage.html || (mirage.html = {}));
})(mirage || (mirage = {}));
var mirage;
(function (mirage) {
    var html;
    (function (html) {
        function NewOrchestrator(target) {
            var tree = html.NewTreeTracker();
            var binders = [];
            var registry = html.NewBinderRegistry(tree, binders);
            var sync = html.NewTreeSynchronizer(target, tree, registry);
            var clock = html.NewAnimClock(onFrame);
            function onFrame(now, delta) {
                for (var i = 0; i < binders.length; i++) {
                    binders[i].run();
                }
            }
            return {
                tree: tree,
                binders: binders,
                registry: registry,
                sync: sync,
                start: function () {
                    sync.start(true);
                    clock.enable();
                },
                stop: function () {
                    clock.disable();
                    sync.stop();
                },
            };
        }
        html.NewOrchestrator = NewOrchestrator;
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
                        var inserted = [];
                        for (var j = 0; j < entries.length; j++) {
                            var entry = entries[j];
                            if (inserted.indexOf(entry.node) > -1)
                                continue;
                            inserted.push(entry.node);
                            panel.insertChild(entry.node, entry.index);
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
        function NewTreeSynchronizer(target, tree, registry, translator) {
            tree = tree || html.NewTreeTracker();
            registry = registry || html.NewBinderRegistry(tree);
            translator = translator || html.NewElementTranslator();
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
                var node = translator.translateNew(el);
                if (!node) {
                    return;
                }
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
                else {
                    for (var walker = node.tree.walk(); walker.step();) {
                        walker.current.setParent(null);
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
            function mirrorTranslations(changes, addedRoots, destroyedRoots) {
                for (var i = 0; i < changes.length; i++) {
                    var change = changes[i];
                    var node = tree.getNodeByElement(change.target);
                    var result = translator.translateChange(change.target, node, change.oldValue);
                    if (result !== node) {
                        replaceNode(node, result, addedRoots, destroyedRoots);
                    }
                    else if (!result) {
                        deregister(change.target, true, addedRoots, destroyedRoots);
                    }
                }
            }
            function replaceNode(oldNode, newNode, addedRoots, destroyedRoots) {
                var uid = tree.replaceNode(oldNode, newNode);
                if (!uid)
                    return;
                var parentNode = oldNode.tree.parent;
                if (parentNode instanceof mirage.Panel) {
                    var index = parentNode.indexOfChild(oldNode);
                    parentNode.removeChild(oldNode);
                    parentNode.insertChild(newNode, index);
                }
                else if (!parentNode) {
                    destroyedRoots.push(oldNode);
                    addedRoots.push(newNode);
                }
                else {
                    oldNode.setParent(null);
                    newNode.setParent(parentNode);
                }
                if (newNode instanceof mirage.Panel) {
                    for (var walker = oldNode.tree.walk(); walker.step();) {
                        newNode.appendChild(walker.current);
                    }
                    if (oldNode instanceof mirage.Panel)
                        oldNode.tree.children.length = 0;
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
            function update(added, removed, untagged, changed) {
                var inserter = html.NewPanelInserter();
                var addedRoots = [];
                var destroyedRoots = [];
                mirrorAdded(added);
                mirrorUntagged(untagged, addedRoots, destroyedRoots);
                mirrorRemoved(removed, addedRoots, destroyedRoots);
                mirrorTranslations(changed, addedRoots, destroyedRoots);
                mirrorAncestry(added, addedRoots, inserter);
                inserter.commit();
                registry.update(addedRoots, destroyedRoots);
            }
            function init() {
                var added = [];
                scan(target, added, false);
                update(added, [], [], []);
            }
            function scan(el, added, parentIsMirage) {
                var isMirage = html.isMirageElement(el);
                if (isMirage && !parentIsMirage)
                    added.push(el);
                for (var cur = el.firstElementChild; !!cur; cur = cur.nextElementSibling) {
                    scan(cur, added, isMirage);
                }
            }
            var monitor = html.NewDOMMonitor(target, update);
            return {
                start: function (initialize) {
                    if (initialize)
                        init();
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
                replaceNode: function (oldNode, newNode) {
                    var uid = oldNode.getAttached("mirage-uid");
                    if (nodes[uid] === oldNode) {
                        oldNode.setAttached("mirage-uid", undefined);
                        newNode.setAttached("mirage-uid", uid);
                        nodes[uid] = newNode;
                        return uid;
                    }
                    return "";
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

//# sourceMappingURL=mirage-html.plugin.js.map
