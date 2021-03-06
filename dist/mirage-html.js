var mirage;
(function (mirage) {
    mirage.version = '0.1.1';
})(mirage || (mirage = {}));
var mirage;
(function (mirage) {
    var core;
    (function (core) {
        core.DEFAULT_VISIBLE = true;
        core.DEFAULT_USE_LAYOUT_ROUNDING = true;
        core.DEFAULT_WIDTH = NaN;
        core.DEFAULT_HEIGHT = NaN;
        core.DEFAULT_MIN_WIDTH = 0.0;
        core.DEFAULT_MIN_HEIGHT = 0.0;
        core.DEFAULT_MAX_WIDTH = Number.POSITIVE_INFINITY;
        core.DEFAULT_MAX_HEIGHT = Number.POSITIVE_INFINITY;
        var LayoutNode = (function () {
            function LayoutNode() {
                this.init();
            }
            LayoutNode.prototype.init = function () {
                Object.defineProperties(this, {
                    "inputs": { value: this.createInputs(), writable: false },
                    "state": { value: this.createState(), writable: false },
                    "tree": { value: this.createTree(), writable: false },
                    "attached": { value: {}, writable: false },
                });
                this.$measurer = this.createMeasurer();
                this.$arranger = this.createArranger();
            };
            LayoutNode.prototype.createInputs = function () {
                return {
                    visible: true,
                    useLayoutRounding: true,
                    margin: new mirage.Thickness(),
                    width: NaN,
                    height: NaN,
                    minWidth: 0.0,
                    minHeight: 0.0,
                    maxWidth: Number.POSITIVE_INFINITY,
                    maxHeight: Number.POSITIVE_INFINITY,
                    horizontalAlignment: mirage.HorizontalAlignment.stretch,
                    verticalAlignment: mirage.VerticalAlignment.stretch,
                    attached: {},
                };
            };
            LayoutNode.prototype.createState = function () {
                return {
                    flags: core.LayoutFlags.none,
                    lastAvailable: new mirage.Size(NaN, NaN),
                    desiredSize: new mirage.Size(),
                    hiddenDesire: new mirage.Size(),
                    layoutSlot: new mirage.Rect(NaN, NaN, NaN, NaN),
                    arrangedSlot: new mirage.Rect(),
                    lastArrangedSlot: new mirage.Rect(NaN, NaN, NaN, NaN),
                };
            };
            LayoutNode.prototype.createTree = function () {
                return core.DefaultLayoutTree();
            };
            LayoutNode.prototype.createMeasurer = function () {
                var _this = this;
                return core.NewMeasurer(this.inputs, this.state, this.tree, function (constraint) { return _this.measureOverride(constraint); });
            };
            LayoutNode.prototype.createArranger = function () {
                var _this = this;
                return core.NewArranger(this.inputs, this.state, this.tree, function (arrangeSize) { return _this.arrangeOverride(arrangeSize); });
            };
            Object.defineProperty(LayoutNode.prototype, "visible", {
                get: function () {
                    return this.inputs.visible;
                },
                set: function (value) {
                    if (this.inputs.visible === value)
                        return;
                    this.inputs.visible = value === true;
                    this.invalidateMeasure();
                    var parent = this.tree.parent;
                    if (parent)
                        parent.invalidateMeasure();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LayoutNode.prototype, "useLayoutRounding", {
                get: function () {
                    return this.inputs.useLayoutRounding;
                },
                set: function (value) {
                    if (this.inputs.useLayoutRounding === value)
                        return;
                    this.inputs.useLayoutRounding = value === true;
                    this.invalidateMeasure();
                    this.invalidateArrange();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LayoutNode.prototype, "margin", {
                get: function () {
                    return this.inputs.margin;
                },
                set: function (value) {
                    if (!value)
                        value = new mirage.Thickness();
                    if (mirage.Thickness.isEqual(this.inputs.margin, value))
                        return;
                    this.inputs.margin = value;
                    onNodeSizeInputsChanged(this);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LayoutNode.prototype, "width", {
                get: function () {
                    return this.inputs.width;
                },
                set: function (value) {
                    if (value == null)
                        value = core.DEFAULT_WIDTH;
                    if (this.inputs.width === value)
                        return;
                    this.inputs.width = value;
                    onNodeSizeInputsChanged(this);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LayoutNode.prototype, "height", {
                get: function () {
                    return this.inputs.height;
                },
                set: function (value) {
                    if (value == null)
                        value = core.DEFAULT_HEIGHT;
                    if (this.inputs.height === value)
                        return;
                    this.inputs.height = value;
                    onNodeSizeInputsChanged(this);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LayoutNode.prototype, "minWidth", {
                get: function () {
                    return this.inputs.minWidth;
                },
                set: function (value) {
                    if (value == null)
                        value = core.DEFAULT_MIN_WIDTH;
                    if (this.inputs.minWidth === value)
                        return;
                    this.inputs.minWidth = value;
                    onNodeSizeInputsChanged(this);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LayoutNode.prototype, "minHeight", {
                get: function () {
                    return this.inputs.minHeight;
                },
                set: function (value) {
                    if (value == null)
                        value = core.DEFAULT_MIN_HEIGHT;
                    if (this.inputs.minHeight === value)
                        return;
                    this.inputs.minHeight = value;
                    onNodeSizeInputsChanged(this);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LayoutNode.prototype, "maxWidth", {
                get: function () {
                    return this.inputs.maxWidth;
                },
                set: function (value) {
                    if (value == null)
                        value = core.DEFAULT_MAX_WIDTH;
                    if (this.inputs.maxWidth === value)
                        return;
                    this.inputs.maxWidth = value;
                    onNodeSizeInputsChanged(this);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LayoutNode.prototype, "maxHeight", {
                get: function () {
                    return this.inputs.maxHeight;
                },
                set: function (value) {
                    if (value == null)
                        value = core.DEFAULT_MAX_HEIGHT;
                    if (this.inputs.maxHeight === value)
                        return;
                    this.inputs.maxHeight = value;
                    onNodeSizeInputsChanged(this);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LayoutNode.prototype, "horizontalAlignment", {
                get: function () {
                    return this.inputs.horizontalAlignment;
                },
                set: function (value) {
                    value = value || 0;
                    if (this.inputs.horizontalAlignment === value)
                        return;
                    this.inputs.horizontalAlignment = value;
                    this.invalidateArrange();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LayoutNode.prototype, "verticalAlignment", {
                get: function () {
                    return this.inputs.verticalAlignment;
                },
                set: function (value) {
                    value = value || 0;
                    if (this.inputs.verticalAlignment === value)
                        return;
                    this.inputs.verticalAlignment = value;
                    this.invalidateArrange();
                },
                enumerable: true,
                configurable: true
            });
            LayoutNode.prototype.getAttached = function (property) {
                return this.inputs.attached[property];
            };
            LayoutNode.prototype.setAttached = function (property, value) {
                if (value === undefined) {
                    delete this.inputs.attached[property];
                }
                else {
                    this.inputs.attached[property] = value;
                }
            };
            LayoutNode.prototype.setParent = function (parent) {
                if (!parent) {
                    if (!this.tree.parent)
                        return;
                    this.tree.parent = null;
                    this.onDetached();
                }
                else {
                    if (parent === this.tree.parent)
                        return;
                    this.tree.parent = null;
                    this.onDetached();
                    this.tree.parent = parent;
                    this.onAttached();
                }
            };
            LayoutNode.prototype.onDetached = function () {
                this.invalidateMeasure();
                if (this.tree.parent)
                    this.tree.parent.invalidateMeasure();
                mirage.Rect.undef(this.state.layoutSlot);
            };
            LayoutNode.prototype.onAttached = function () {
                var state = this.state;
                mirage.Size.undef(state.lastAvailable);
                mirage.Rect.undef(state.layoutSlot);
                mirage.Size.clear(state.arrangedSlot);
                this.invalidateMeasure();
                this.invalidateArrange();
                if ((state.flags & core.LayoutFlags.slotHint) > 0 || !mirage.Rect.isUndef(state.lastArrangedSlot)) {
                    this.tree.propagateFlagUp(core.LayoutFlags.slotHint);
                }
            };
            LayoutNode.prototype.walkDeep = function (reverse) {
                var last = undefined;
                var walkList = [this];
                return {
                    current: undefined,
                    step: function () {
                        if (last) {
                            for (var subwalker = last.tree.walk(reverse); subwalker.step();) {
                                walkList.unshift(subwalker.current);
                            }
                        }
                        this.current = last = walkList.shift();
                        return this.current !== undefined;
                    },
                    skipBranch: function () {
                        last = undefined;
                    },
                };
            };
            LayoutNode.prototype.invalidateMeasure = function () {
                this.state.flags |= core.LayoutFlags.measure | core.LayoutFlags.measureHint;
                this.tree.propagateFlagUp(core.LayoutFlags.measureHint);
            };
            LayoutNode.prototype.doMeasure = function (rootSize) {
                mirage.logger.doMeasure(this);
                var parent = this.tree.parent;
                var available = new mirage.Size();
                if (!parent) {
                    mirage.Size.copyTo(rootSize, available);
                }
                else {
                    mirage.Size.copyTo(this.state.lastAvailable, available);
                }
                if (!mirage.Size.isUndef(available)) {
                    mirage.logger.measure(this, available);
                    var change = this.$measurer(available);
                    mirage.logger.finishMeasure(this);
                    if (!change)
                        return false;
                }
                if (parent)
                    parent.invalidateMeasure();
                this.state.flags &= ~core.LayoutFlags.measure;
                return true;
            };
            LayoutNode.prototype.measure = function (availableSize) {
                mirage.logger.measure(this, availableSize);
                var change = this.$measurer(availableSize);
                mirage.logger.finishMeasure(this);
                return change;
            };
            LayoutNode.prototype.measureOverride = function (constraint) {
                var desired = new mirage.Size();
                for (var walker = this.tree.walk(); walker.step();) {
                    walker.current.measure(constraint);
                    mirage.Size.max(desired, walker.current.state.desiredSize);
                }
                return desired;
            };
            LayoutNode.prototype.invalidateArrange = function () {
                this.state.flags |= core.LayoutFlags.arrange | core.LayoutFlags.arrangeHint;
                this.tree.propagateFlagUp(core.LayoutFlags.arrangeHint);
            };
            LayoutNode.prototype.doArrange = function (rootSize) {
                mirage.logger.doArrange(this);
                var parent = this.tree.parent;
                var final = new mirage.Rect();
                if (!parent) {
                    mirage.Size.copyTo(rootSize, final);
                    if (!isFinite(final.width))
                        final.width = this.state.desiredSize.width;
                    if (!isFinite(final.height))
                        final.height = this.state.desiredSize.height;
                }
                else {
                    mirage.Size.copyTo(this.state.desiredSize, final);
                }
                if (!mirage.Rect.isUndef(final)) {
                    mirage.logger.arrange(this, final);
                    var change = this.$arranger(final);
                    mirage.logger.finishArrange(this);
                    if (!change)
                        return false;
                }
                if (parent)
                    parent.invalidateArrange();
                return true;
            };
            LayoutNode.prototype.arrange = function (finalRect) {
                mirage.logger.arrange(this, finalRect);
                var change = this.$arranger(finalRect);
                mirage.logger.finishArrange(this);
                return change;
            };
            LayoutNode.prototype.arrangeOverride = function (arrangeSize) {
                var arranged = new mirage.Size(arrangeSize.width, arrangeSize.height);
                for (var walker = this.tree.walk(); walker.step();) {
                    var childRect = new mirage.Rect(0, 0, arrangeSize.width, arrangeSize.height);
                    walker.current.arrange(childRect);
                }
                return arranged;
            };
            LayoutNode.prototype.slot = function (oldRect, newRect) {
                var state = this.state;
                if (!mirage.Rect.isUndef(state.lastArrangedSlot))
                    mirage.Rect.copyTo(state.lastArrangedSlot, oldRect);
                mirage.Rect.copyTo(state.arrangedSlot, newRect);
                mirage.Rect.undef(state.lastArrangedSlot);
                return true;
            };
            return LayoutNode;
        })();
        core.LayoutNode = LayoutNode;
        function onNodeSizeInputsChanged(node) {
            node.invalidateMeasure();
            node.invalidateArrange();
            var parent = node.tree.parent;
            if (parent)
                parent.invalidateMeasure();
        }
    })(core = mirage.core || (mirage.core = {}));
})(mirage || (mirage = {}));
var mirage;
(function (mirage) {
    var typeCreators = {};
    function createNodeByType(type) {
        var creator = typeCreators[type];
        if (!creator)
            return new mirage.core.LayoutNode();
        return new creator();
    }
    mirage.createNodeByType = createNodeByType;
    function registerNodeType(type, creator) {
        if (typeCreators[type]) {
            console.warn("[mirage] Overriding type registration for " + type);
        }
        typeCreators[type] = creator;
    }
    mirage.registerNodeType = registerNodeType;
})(mirage || (mirage = {}));
/// <reference path="core/LayoutNode" />
/// <reference path="typeLookup" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var mirage;
(function (mirage) {
    var Panel = (function (_super) {
        __extends(Panel, _super);
        function Panel() {
            _super.apply(this, arguments);
        }
        Panel.prototype.createTree = function () {
            return NewPanelTree();
        };
        Panel.prototype.measureOverride = function (constraint) {
            var measured = new mirage.Size();
            for (var walker = this.tree.walk(); walker.step();) {
                var child = walker.current;
                child.measure(constraint);
                mirage.Size.max(measured, child.state.desiredSize);
            }
            return measured;
        };
        Panel.prototype.arrangeOverride = function (arrangeSize) {
            var finalRect = new mirage.Rect(0, 0, arrangeSize.width, arrangeSize.height);
            for (var walker = this.tree.walk(); walker.step();) {
                walker.current.arrange(finalRect);
            }
            return new mirage.Size(arrangeSize.width, arrangeSize.height);
        };
        Object.defineProperty(Panel.prototype, "childCount", {
            get: function () {
                return this.tree.children.length;
            },
            enumerable: true,
            configurable: true
        });
        Panel.prototype.insertChild = function (child, index) {
            var children = this.tree.children;
            if (index >= children.length) {
                this.appendChild(child);
            }
            else if (index <= 0) {
                this.prependChild(child);
            }
            else {
                children.splice(index, 0, child);
                child.setParent(this);
            }
        };
        Panel.prototype.prependChild = function (child) {
            this.tree.children.unshift(child);
            child.setParent(this);
        };
        Panel.prototype.appendChild = function (child) {
            this.tree.children.push(child);
            child.setParent(this);
        };
        Panel.prototype.removeChild = function (child) {
            var children = this.tree.children;
            var index = children.indexOf(child);
            if (index < 0)
                return false;
            this.tree.children.splice(index, 1);
            child.setParent(null);
            return true;
        };
        Panel.prototype.removeChildAt = function (index) {
            var children = this.tree.children;
            if (index < 0 || index >= children.length)
                return null;
            var removed = children.splice(index, 1)[0];
            if (removed)
                removed.setParent(null);
            return removed;
        };
        Panel.prototype.getChildAt = function (index) {
            return this.tree.children[index];
        };
        Panel.prototype.indexOfChild = function (child) {
            return this.tree.children.indexOf(child);
        };
        return Panel;
    })(mirage.core.LayoutNode);
    mirage.Panel = Panel;
    mirage.registerNodeType("panel", Panel);
    function NewPanelTree() {
        var tree = mirage.core.DefaultLayoutTree();
        tree.children = [];
        tree.walk = function (reverse) {
            if (!reverse) {
                var i = -1;
                return {
                    current: undefined,
                    step: function () {
                        i++;
                        if (i >= tree.children.length) {
                            this.current = undefined;
                            return false;
                        }
                        this.current = tree.children[i];
                        return true;
                    },
                };
            }
            else {
                var i = tree.children.length;
                return {
                    current: undefined,
                    step: function () {
                        i--;
                        if (i < 0) {
                            this.current = undefined;
                            return false;
                        }
                        this.current = tree.children[i];
                        return true;
                    },
                };
            }
        };
        return tree;
    }
    mirage.NewPanelTree = NewPanelTree;
})(mirage || (mirage = {}));
var mirage;
(function (mirage) {
    var Thickness = (function () {
        function Thickness(left, top, right, bottom) {
            this.left = left == null ? 0 : left;
            this.top = top == null ? 0 : top;
            this.right = right == null ? 0 : right;
            this.bottom = bottom == null ? 0 : bottom;
        }
        Thickness.isEqual = function (t1, t2) {
            return t1.left === t2.left
                && t1.top === t2.top
                && t1.right === t2.right
                && t1.bottom === t2.bottom;
        };
        Thickness.growSize = function (thickness, dest) {
            var w = dest.width;
            var h = dest.height;
            if (w != Number.POSITIVE_INFINITY)
                w += thickness.left + thickness.right;
            if (h != Number.POSITIVE_INFINITY)
                h += thickness.top + thickness.bottom;
            dest.width = w > 0 ? w : 0;
            dest.height = h > 0 ? h : 0;
            return dest;
        };
        Thickness.shrinkSize = function (thickness, dest) {
            var w = dest.width;
            var h = dest.height;
            if (w != Number.POSITIVE_INFINITY)
                w -= thickness.left + thickness.right;
            if (h != Number.POSITIVE_INFINITY)
                h -= thickness.top + thickness.bottom;
            dest.width = w > 0 ? w : 0;
            dest.height = h > 0 ? h : 0;
            return dest;
        };
        Thickness.shrinkRect = function (thickness, dest) {
            dest.x += thickness.left;
            dest.y += thickness.top;
            dest.width -= thickness.left + thickness.right;
            dest.height -= thickness.top + thickness.bottom;
            if (dest.width < 0)
                dest.width = 0;
            if (dest.height < 0)
                dest.height = 0;
        };
        return Thickness;
    })();
    mirage.Thickness = Thickness;
})(mirage || (mirage = {}));
/// <reference path="../Thickness" />
var mirage;
(function (mirage) {
    var convert;
    (function (convert) {
        var converters = {};
        function register(property, converter) {
            converters[property] = converter;
        }
        convert.register = register;
        function getConverter(property) {
            return converters[property];
        }
        convert.getConverter = getConverter;
    })(convert = mirage.convert || (mirage.convert = {}));
})(mirage || (mirage = {}));
/// <reference path="../convert/converters" />
var mirage;
(function (mirage) {
    var map;
    (function (map) {
        var setters = {};
        var mappers = {};
        function getSetter(property) {
            var setter = setters[property];
            if (!setter && property.indexOf(".") > -1) {
                setter = function (node, value) { return node.setAttached(property, value); };
            }
            return setter;
        }
        map.getSetter = getSetter;
        function getMapper(property) {
            var mapper = mappers[property];
            if (!mapper && property.indexOf(".") > -1) {
                mapper = function (node, value) { return node.setAttached(property, value); };
            }
            return mapper;
        }
        map.getMapper = getMapper;
        function registerNormal(property, key) {
            setters[property] = function (node, value) { return node[key] = value; };
            var converter = mirage.convert.getConverter(property);
            mappers[property] = function (node, value) { return node[key] = converter(value); };
        }
        map.registerNormal = registerNormal;
        function registerCustom(property, setter) {
            setters[property] = setter;
            var converter = mirage.convert.getConverter(property);
            mappers[property] = function (node, value) { return setter(node, converter(value)); };
        }
        map.registerCustom = registerCustom;
    })(map = mirage.map || (mirage.map = {}));
})(mirage || (mirage = {}));
/// <reference path="Panel" />
/// <reference path="typeLookup" />
/// <reference path="convert/converters" />
/// <reference path="map/mappers" />
var mirage;
(function (mirage) {
    var Canvas = (function (_super) {
        __extends(Canvas, _super);
        function Canvas() {
            _super.apply(this, arguments);
        }
        Canvas.getLeft = function (node) {
            return node.getAttached("canvas.left");
        };
        Canvas.setLeft = function (node, value) {
            node.setAttached("canvas.left", value);
            node.invalidateArrange();
        };
        Canvas.getTop = function (node) {
            return node.getAttached("canvas.top");
        };
        Canvas.setTop = function (node, value) {
            node.setAttached("canvas.top", value);
            node.invalidateArrange();
        };
        Canvas.prototype.measureOverride = function (constraint) {
            var available = new mirage.Size(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
            for (var walker = this.tree.walk(); walker.step();) {
                walker.current.measure(available);
            }
            return new mirage.Size();
        };
        Canvas.prototype.arrangeOverride = function (arrangeSize) {
            var cr = new mirage.Rect();
            for (var walker = this.tree.walk(); walker.step();) {
                var child = walker.current;
                cr.x = Canvas.getLeft(child) || 0;
                cr.y = Canvas.getTop(child) || 0;
                mirage.Size.copyTo(child.state.desiredSize, cr);
                child.arrange(cr);
            }
            return arrangeSize;
        };
        return Canvas;
    })(mirage.Panel);
    mirage.Canvas = Canvas;
    mirage.registerNodeType("canvas", Canvas);
    mirage.convert.register("canvas.left", convertCanvasCoord);
    mirage.convert.register("canvas.top", convertCanvasCoord);
    mirage.map.registerCustom("canvas.left", Canvas.setLeft);
    mirage.map.registerCustom("canvas.top", Canvas.setTop);
    function convertCanvasCoord(value) {
        if (!value)
            return 0;
        return parseFloat(value);
    }
})(mirage || (mirage = {}));
var mirage;
(function (mirage) {
    (function (HorizontalAlignment) {
        HorizontalAlignment[HorizontalAlignment["stretch"] = 0] = "stretch";
        HorizontalAlignment[HorizontalAlignment["left"] = 1] = "left";
        HorizontalAlignment[HorizontalAlignment["center"] = 2] = "center";
        HorizontalAlignment[HorizontalAlignment["right"] = 3] = "right";
    })(mirage.HorizontalAlignment || (mirage.HorizontalAlignment = {}));
    var HorizontalAlignment = mirage.HorizontalAlignment;
    (function (VerticalAlignment) {
        VerticalAlignment[VerticalAlignment["stretch"] = 0] = "stretch";
        VerticalAlignment[VerticalAlignment["top"] = 1] = "top";
        VerticalAlignment[VerticalAlignment["center"] = 2] = "center";
        VerticalAlignment[VerticalAlignment["bottom"] = 3] = "bottom";
    })(mirage.VerticalAlignment || (mirage.VerticalAlignment = {}));
    var VerticalAlignment = mirage.VerticalAlignment;
    (function (Orientation) {
        Orientation[Orientation["horizontal"] = 0] = "horizontal";
        Orientation[Orientation["vertical"] = 1] = "vertical";
    })(mirage.Orientation || (mirage.Orientation = {}));
    var Orientation = mirage.Orientation;
})(mirage || (mirage = {}));
var mirage;
(function (mirage) {
    function NewRowDefinition() {
        var len;
        var min = 0;
        var max = Number.POSITIVE_INFINITY;
        switch (arguments.length) {
            case 1:
                return parseGridRowDef(arguments[0]);
            case 2:
                len = {
                    value: arguments[0],
                    type: arguments[1],
                };
                break;
            case 3:
                len = mirage.parseGridLength(arguments[0]);
                min = arguments[1];
                max = arguments[2];
                break;
            case 4:
                len = {
                    value: arguments[0],
                    type: arguments[1],
                };
                min = arguments[2];
                max = arguments[3];
                break;
            default:
                len = {
                    value: 1,
                    type: mirage.GridUnitType.star,
                };
                break;
        }
        var actual = NaN;
        return {
            height: len,
            minHeight: min,
            maxHeight: max,
            getActualHeight: function () {
                return actual;
            },
            setActualHeight: function (value) {
                actual = value;
            },
        };
    }
    mirage.NewRowDefinition = NewRowDefinition;
    function parseGridRowDef(raw) {
        var len;
        var min = 0;
        var max = Number.POSITIVE_INFINITY;
        if (raw[0] === "(" && raw[raw.length - 1] === ")") {
            var tokens = raw.substr(1, raw.length - 2).split(" ");
            len = mirage.parseGridLength(tokens[0]);
            len.value = len.value || 0;
            min = parseInt(tokens[1]) || 0;
            max = parseInt(tokens[2]);
            if (isNaN(max)) {
                max = Number.POSITIVE_INFINITY;
            }
        }
        else {
            len = mirage.parseGridLength(raw);
        }
        var actual = NaN;
        return {
            height: len,
            minHeight: min,
            maxHeight: max,
            getActualHeight: function () {
                return actual;
            },
            setActualHeight: function (value) {
                actual = value;
            },
        };
    }
})(mirage || (mirage = {}));
var mirage;
(function (mirage) {
    function NewColumnDefinition() {
        var len;
        var min = 0;
        var max = Number.POSITIVE_INFINITY;
        switch (arguments.length) {
            case 1:
                return parseGridColDef(arguments[0]);
            case 2:
                len = {
                    value: arguments[0],
                    type: arguments[1],
                };
                break;
            case 3:
                len = mirage.parseGridLength(arguments[0]);
                min = arguments[1];
                max = arguments[2];
                break;
            case 4:
                len = {
                    value: arguments[0],
                    type: arguments[1],
                };
                min = arguments[2];
                max = arguments[3];
                break;
            default:
                len = {
                    value: 1,
                    type: mirage.GridUnitType.star,
                };
                break;
        }
        var actual = NaN;
        return {
            width: len,
            minWidth: min,
            maxWidth: max,
            getActualWidth: function () {
                return actual;
            },
            setActualWidth: function (value) {
                actual = value;
            },
        };
    }
    mirage.NewColumnDefinition = NewColumnDefinition;
    function parseGridColDef(raw) {
        var len;
        var min = 0;
        var max = Number.POSITIVE_INFINITY;
        if (raw[0] === "(" && raw[raw.length - 1] === ")") {
            var tokens = raw.substr(1, raw.length - 2).split(" ");
            len = mirage.parseGridLength(tokens[0]);
            len.value = len.value || 0;
            min = parseInt(tokens[1]) || 0;
            max = parseInt(tokens[2]);
            if (isNaN(max)) {
                max = Number.POSITIVE_INFINITY;
            }
        }
        else {
            len = mirage.parseGridLength(raw);
        }
        var actual = NaN;
        return {
            width: len,
            minWidth: min,
            maxWidth: max,
            getActualWidth: function () {
                return actual;
            },
            setActualWidth: function (value) {
                actual = value;
            },
        };
    }
})(mirage || (mirage = {}));
var mirage;
(function (mirage) {
    function NewRowDefinitions(defs) {
        var rowdefs = [];
        for (var walker = walkDefinitions(defs); walker.walk();) {
            rowdefs.push(mirage.NewRowDefinition(walker.current));
        }
        return rowdefs;
    }
    mirage.NewRowDefinitions = NewRowDefinitions;
    function NewColumnDefinitions(defs) {
        var coldefs = [];
        for (var walker = walkDefinitions(defs); walker.walk();) {
            coldefs.push(mirage.NewColumnDefinition(walker.current));
        }
        return coldefs;
    }
    mirage.NewColumnDefinitions = NewColumnDefinitions;
    function walkDefinitions(defs) {
        var index = 0;
        var d = {
            current: "",
            walk: function () {
                if (defs[index] === "(") {
                    var next = defs.indexOf(")", index);
                    d.current = (next > -1)
                        ? defs.substr(index, next - index + 1)
                        : defs.substr(index);
                }
                else {
                    var next = defs.indexOf(" ", index);
                    d.current = (next > -1)
                        ? defs.substr(index, next - index)
                        : defs.substr(index);
                }
                index += d.current.length + 1;
                return d.current && d.current != " ";
            },
        };
        return d;
    }
})(mirage || (mirage = {}));
/// <reference path="Panel" />
/// <reference path="typeLookup" />
/// <reference path="convert/converters" />
/// <reference path="map/mappers" />
/// <reference path="IRowDefinition" />
/// <reference path="IColumnDefinition" />
/// <reference path="GridDefinitions" />
var mirage;
(function (mirage) {
    var Grid = (function (_super) {
        __extends(Grid, _super);
        function Grid() {
            _super.apply(this, arguments);
        }
        Grid.getColumn = function (node) {
            return node.getAttached("grid.column");
        };
        Grid.setColumn = function (node, value) {
            node.setAttached("grid.column", value);
            invalidateCell(node);
        };
        Grid.getColumnSpan = function (node) {
            return node.getAttached("grid.column-span");
        };
        Grid.setColumnSpan = function (node, value) {
            node.setAttached("grid.column-span", value);
            invalidateCell(node);
        };
        Grid.getRow = function (node) {
            return node.getAttached("grid.row");
        };
        Grid.setRow = function (node, value) {
            node.setAttached("grid.row", value);
            invalidateCell(node);
        };
        Grid.getRowSpan = function (node) {
            return node.getAttached("grid.row-span");
        };
        Grid.setRowSpan = function (node, value) {
            node.setAttached("grid.row-span", value);
            invalidateCell(node);
        };
        Grid.prototype.init = function () {
            _super.prototype.init.call(this);
            this.$measureOverride = mirage.grid.NewGridMeasureOverride(this.inputs, this.state, this.tree);
            this.$arrangeOverride = mirage.grid.NewGridArrangeOverride(this.inputs, this.state, this.tree);
        };
        Object.defineProperty(Grid.prototype, "rowDefinitions", {
            get: function () {
                return this.inputs.rowDefinitions;
            },
            set: function (value) {
                if (!value)
                    value = [];
                this.inputs.rowDefinitions = value;
                this.invalidateMeasure();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Grid.prototype, "columnDefinitions", {
            get: function () {
                return this.inputs.columnDefinitions;
            },
            set: function (value) {
                if (!value)
                    value = [];
                this.inputs.columnDefinitions = value;
                this.invalidateMeasure();
            },
            enumerable: true,
            configurable: true
        });
        Grid.prototype.createInputs = function () {
            var inputs = _super.prototype.createInputs.call(this);
            inputs.rowDefinitions = [];
            inputs.columnDefinitions = [];
            return inputs;
        };
        Grid.prototype.createState = function () {
            var state = _super.prototype.createState.call(this);
            state.design = mirage.grid.design.NewGridDesign();
            return state;
        };
        Grid.prototype.measureOverride = function (constraint) {
            return this.$measureOverride(constraint);
        };
        Grid.prototype.arrangeOverride = function (arrangeSize) {
            return this.$arrangeOverride(arrangeSize);
        };
        return Grid;
    })(mirage.Panel);
    mirage.Grid = Grid;
    mirage.registerNodeType("grid", Grid);
    mirage.convert.register("row-definitions", mirage.NewRowDefinitions);
    mirage.convert.register("column-definitions", mirage.NewColumnDefinitions);
    mirage.convert.register("grid.row", convertGridCell);
    mirage.convert.register("grid.row-span", convertGridCell);
    mirage.convert.register("grid.column", convertGridCell);
    mirage.convert.register("grid.column-span", convertGridCell);
    mirage.map.registerNormal("row-definitions", "rowDefinitions");
    mirage.map.registerNormal("column-definitions", "columnDefinitions");
    mirage.map.registerCustom("grid.row", Grid.setRow);
    mirage.map.registerCustom("grid.row-span", Grid.setRowSpan);
    mirage.map.registerCustom("grid.column", Grid.setColumn);
    mirage.map.registerCustom("grid.column-span", Grid.setColumnSpan);
    function invalidateCell(node) {
        var parent = node.tree.parent;
        if (parent instanceof Grid)
            parent.invalidateMeasure();
        node.invalidateMeasure();
    }
    function convertGridCell(value) {
        if (!value)
            return 0;
        return parseInt(value);
    }
})(mirage || (mirage = {}));
var mirage;
(function (mirage) {
    (function (GridUnitType) {
        GridUnitType[GridUnitType["auto"] = 0] = "auto";
        GridUnitType[GridUnitType["pixel"] = 1] = "pixel";
        GridUnitType[GridUnitType["star"] = 2] = "star";
    })(mirage.GridUnitType || (mirage.GridUnitType = {}));
    var GridUnitType = mirage.GridUnitType;
    function parseGridLength(s) {
        var auto = { value: 0, type: GridUnitType.auto };
        if (s === "auto") {
            return auto;
        }
        if (s[s.length - 1] === "*") {
            if (s.length === 1)
                return { value: 1, type: GridUnitType.star };
            return {
                value: parseInt(s.substr(0, s.length - 1)),
                type: GridUnitType.star,
            };
        }
        return {
            value: parseInt(s),
            type: GridUnitType.pixel,
        };
    }
    mirage.parseGridLength = parseGridLength;
})(mirage || (mirage = {}));
var mirage;
(function (mirage) {
    var adapters;
    (function (adapters) {
        var registered = [];
        function register(adapter) {
            if (registered.indexOf(adapter) < 0) {
                registered.push(adapter);
            }
        }
        adapters.register = register;
        function unregister(adapter) {
            var index = registered.indexOf(adapter);
            if (index > -1)
                registered.splice(index, 1);
        }
        adapters.unregister = unregister;
        function updateSlots(updates) {
            for (var i = 0; i < registered.length; i++) {
                registered[i].updateSlots(updates);
            }
        }
        adapters.updateSlots = updateSlots;
    })(adapters = mirage.adapters || (mirage.adapters = {}));
})(mirage || (mirage = {}));
var mirage;
(function (mirage) {
    var Point = (function () {
        function Point(x, y) {
            this.x = x == null ? 0 : x;
            this.y = y == null ? 0 : y;
        }
        Point.isEqual = function (p1, p2) {
            return p1.x === p2.x
                && p1.y === p2.y;
        };
        Point.copyTo = function (src, dest) {
            dest.x = src.x;
            dest.y = src.y;
        };
        Point.round = function (dest) {
            dest.x = Math.round(dest.x);
            dest.y = Math.round(dest.y);
        };
        return Point;
    })();
    mirage.Point = Point;
})(mirage || (mirage = {}));
var mirage;
(function (mirage) {
    var Rect = (function () {
        function Rect(x, y, width, height) {
            this.x = x == null ? 0 : x;
            this.y = y == null ? 0 : y;
            this.width = width == null ? 0 : width;
            this.height = height == null ? 0 : height;
        }
        Rect.clear = function (rect) {
            rect.x = rect.y = rect.width = rect.height = 0;
        };
        Rect.isEqual = function (rect1, rect2) {
            return rect1.x === rect2.x
                && rect1.y === rect2.y
                && rect1.width === rect2.width
                && rect1.height === rect2.height;
        };
        Rect.isEmpty = function (src) {
            return src.width === 0
                || src.height === 0;
        };
        Rect.copyTo = function (src, dest) {
            dest.x = src.x;
            dest.y = src.y;
            dest.width = src.width;
            dest.height = src.height;
        };
        Rect.isUndef = function (rect) {
            return isNaN(rect.x)
                && isNaN(rect.y)
                && isNaN(rect.width)
                && isNaN(rect.height);
        };
        Rect.undef = function (rect) {
            rect.x = NaN;
            rect.y = NaN;
            rect.width = NaN;
            rect.height = NaN;
        };
        return Rect;
    })();
    mirage.Rect = Rect;
})(mirage || (mirage = {}));
var mirage;
(function (mirage) {
    var Size = (function () {
        function Size(width, height) {
            this.width = width == null ? 0 : width;
            this.height = height == null ? 0 : height;
        }
        Size.copyTo = function (src, dest) {
            dest.width = src.width;
            dest.height = src.height;
        };
        Size.isEqual = function (size1, size2) {
            return size1.width === size2.width
                && size1.height === size2.height;
        };
        Size.isEmpty = function (size) {
            return size.width === 0
                || size.height === 0;
        };
        Size.max = function (dest, size2) {
            dest.width = Math.max(dest.width, size2.width);
            dest.height = Math.max(dest.height, size2.height);
        };
        Size.min = function (dest, size2) {
            dest.width = Math.min(dest.width, size2.width);
            dest.height = Math.min(dest.height, size2.height);
        };
        Size.round = function (size) {
            size.width = Math.round(size.width);
            size.height = Math.round(size.height);
        };
        Size.clear = function (size) {
            size.width = 0;
            size.height = 0;
        };
        Size.isUndef = function (size) {
            return isNaN(size.width)
                && isNaN(size.height);
        };
        Size.undef = function (size) {
            size.width = NaN;
            size.height = NaN;
        };
        return Size;
    })();
    mirage.Size = Size;
})(mirage || (mirage = {}));
/// <reference path="../convert/converters" />
var mirage;
(function (mirage) {
    var core;
    (function (core) {
        function booleanDefaultTrue(value) {
            return value !== "0"
                && value !== "false";
        }
        function float(value) {
            if (!value)
                return 0;
            return parseFloat(value) || 0;
        }
        function floatDefaultNaN(value) {
            if (!value)
                return NaN;
            return parseFloat(value);
        }
        function floatDefaultInfinite(value) {
            if (!value)
                return Number.POSITIVE_INFINITY;
            var val = parseFloat(value);
            if (isNaN(val))
                return Number.POSITIVE_INFINITY;
            return val;
        }
        function thickness(value) {
            var tokens = splitCommaList(value);
            if (tokens.length === 1) {
                var uniform = parseFloat(tokens[0]);
                return new mirage.Thickness(uniform, uniform, uniform, uniform);
            }
            else if (tokens.length === 2) {
                var x = parseFloat(tokens[0]);
                var y = parseFloat(tokens[1]);
                return new mirage.Thickness(x, y, x, y);
            }
            else if (tokens.length === 4) {
                return new mirage.Thickness(parseFloat(tokens[0]), parseFloat(tokens[1]), parseFloat(tokens[2]), parseFloat(tokens[3]));
            }
            else {
                console.warn("[mirage] Invalid thickness value", value);
            }
        }
        function enumConverter(src) {
            return function (value) {
                if (!value)
                    return 0;
                return src[value] || 0;
            };
        }
        core.enumConverter = enumConverter;
        function splitCommaList(str) {
            var tokens = [];
            for (var i = 0, arr = str.split(' ').join(',').split(','); i < arr.length; i++) {
                var cur = arr[i];
                if (cur)
                    tokens.push(cur);
            }
            return tokens;
        }
        mirage.convert.register("visible", booleanDefaultTrue);
        mirage.convert.register("use-layout-rounding", booleanDefaultTrue);
        mirage.convert.register("margin", thickness);
        mirage.convert.register("width", floatDefaultNaN);
        mirage.convert.register("height", floatDefaultNaN);
        mirage.convert.register("min-width", float);
        mirage.convert.register("min-height", float);
        mirage.convert.register("max-width", floatDefaultInfinite);
        mirage.convert.register("max-height", floatDefaultInfinite);
        mirage.convert.register("horizontal-alignment", enumConverter(mirage.HorizontalAlignment));
        mirage.convert.register("vertical-alignment", enumConverter(mirage.VerticalAlignment));
    })(core = mirage.core || (mirage.core = {}));
})(mirage || (mirage = {}));
/// <reference path="typeLookup" />
/// <reference path="convert/converters" />
/// <reference path="core/converters" />
/// <reference path="map/mappers" />
var mirage;
(function (mirage) {
    var StackPanel = (function (_super) {
        __extends(StackPanel, _super);
        function StackPanel() {
            _super.apply(this, arguments);
        }
        Object.defineProperty(StackPanel.prototype, "orientation", {
            get: function () {
                return this.inputs.orientation;
            },
            set: function (value) {
                value = value || 0;
                if (this.inputs.orientation === value)
                    return;
                this.inputs.orientation = value;
                this.invalidateMeasure();
                this.invalidateArrange();
            },
            enumerable: true,
            configurable: true
        });
        StackPanel.prototype.createInputs = function () {
            var inputs = _super.prototype.createInputs.call(this);
            inputs.orientation = mirage.Orientation.horizontal;
            return inputs;
        };
        StackPanel.prototype.measureOverride = function (constraint) {
            if (this.inputs.orientation === mirage.Orientation.vertical) {
                return this.measureVertical(constraint);
            }
            else {
                return this.measureHorizontal(constraint);
            }
        };
        StackPanel.prototype.measureVertical = function (constraint) {
            var ca = new mirage.Size(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
            var measured = new mirage.Size();
            var inputs = this.inputs;
            ca.width = constraint.width;
            if (!isNaN(inputs.width))
                ca.width = inputs.width;
            ca.width = Math.min(ca.width, inputs.maxWidth);
            ca.width = Math.max(ca.width, inputs.minWidth);
            for (var walker = this.tree.walk(); walker.step();) {
                var child = walker.current;
                child.measure(ca);
                var childDesired = child.state.desiredSize;
                measured.height += childDesired.height;
                measured.width = Math.max(measured.width, childDesired.width);
            }
            return measured;
        };
        StackPanel.prototype.measureHorizontal = function (constraint) {
            var ca = new mirage.Size(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
            var measured = new mirage.Size();
            var inputs = this.inputs;
            ca.height = constraint.height;
            if (!isNaN(inputs.height))
                ca.height = inputs.height;
            ca.height = Math.min(ca.height, inputs.maxHeight);
            ca.height = Math.max(ca.height, inputs.minHeight);
            for (var walker = this.tree.walk(); walker.step();) {
                var child = walker.current;
                child.measure(ca);
                var childDesired = child.state.desiredSize;
                measured.width += childDesired.width;
                measured.height = Math.max(measured.height, childDesired.height);
            }
            return measured;
        };
        StackPanel.prototype.arrangeOverride = function (arrangeSize) {
            if (this.inputs.orientation === mirage.Orientation.vertical) {
                return this.arrangeVertical(arrangeSize);
            }
            else {
                return this.arrangeHorizontal(arrangeSize);
            }
        };
        StackPanel.prototype.arrangeVertical = function (arrangeSize) {
            var arranged = new mirage.Size(arrangeSize.width, 0);
            for (var walker = this.tree.walk(); walker.step();) {
                var child = walker.current;
                var childDesired = child.state.desiredSize;
                var childFinal = new mirage.Rect(0, arranged.height, arrangeSize.width, childDesired.height);
                if (mirage.Rect.isEmpty(childFinal))
                    mirage.Rect.clear(childFinal);
                child.arrange(childFinal);
                arranged.width = Math.max(arranged.width, arrangeSize.width);
                arranged.height += childDesired.height;
            }
            arranged.height = Math.max(arranged.height, arrangeSize.height);
            return arranged;
        };
        StackPanel.prototype.arrangeHorizontal = function (arrangeSize) {
            var arranged = new mirage.Size(0, arrangeSize.height);
            for (var walker = this.tree.walk(); walker.step();) {
                var child = walker.current;
                var childDesired = child.state.desiredSize;
                var childFinal = new mirage.Rect(arranged.width, 0, childDesired.width, arrangeSize.height);
                if (mirage.Rect.isEmpty(childFinal))
                    mirage.Rect.clear(childFinal);
                child.arrange(childFinal);
                arranged.width += childDesired.width;
                arranged.height = Math.max(arranged.height, arrangeSize.height);
            }
            arranged.width = Math.max(arranged.width, arrangeSize.width);
            return arranged;
        };
        return StackPanel;
    })(mirage.Panel);
    mirage.StackPanel = StackPanel;
    mirage.registerNodeType("stack-panel", StackPanel);
    mirage.convert.register("orientation", mirage.core.enumConverter(mirage.Orientation));
    mirage.map.registerNormal("orientation", "orientation");
})(mirage || (mirage = {}));
var mirage;
(function (mirage) {
    var core;
    (function (core) {
        function NewArranger(inputs, state, tree, override) {
            function calcOffer(childRect) {
                var stretched = new mirage.Size(childRect.width, childRect.height);
                core.coerceSize(stretched, inputs);
                var framework = new mirage.Size();
                core.coerceSize(framework, inputs);
                if (inputs.horizontalAlignment === mirage.HorizontalAlignment.stretch) {
                    framework.width = Math.max(framework.width, stretched.width);
                }
                if (inputs.verticalAlignment === mirage.VerticalAlignment.stretch) {
                    framework.height = Math.max(framework.height, stretched.height);
                }
                var offer = new mirage.Size(state.hiddenDesire.width, state.hiddenDesire.height);
                mirage.Size.max(offer, framework);
                return offer;
            }
            function calcVisualOffset(childRect, arranged) {
                var constrained = new mirage.Size(arranged.width, arranged.height);
                core.coerceSize(constrained, inputs);
                mirage.Size.min(constrained, arranged);
                var vo = new mirage.Point();
                mirage.Point.copyTo(childRect, vo);
                switch (inputs.horizontalAlignment) {
                    case mirage.HorizontalAlignment.left:
                        break;
                    case mirage.HorizontalAlignment.right:
                        vo.x += childRect.width - constrained.width;
                        break;
                    case mirage.HorizontalAlignment.center:
                        vo.x += (childRect.width - constrained.width) * 0.5;
                        break;
                    default:
                        vo.x += Math.max((childRect.width - constrained.width) * 0.5, 0);
                        break;
                }
                switch (inputs.verticalAlignment) {
                    case mirage.VerticalAlignment.top:
                        break;
                    case mirage.VerticalAlignment.bottom:
                        vo.y += childRect.height - constrained.height;
                        break;
                    case mirage.VerticalAlignment.center:
                        vo.y += (childRect.height - constrained.height) * 0.5;
                        break;
                    default:
                        vo.y += Math.max((childRect.height - constrained.height) * 0.5, 0);
                        break;
                }
                if (inputs.useLayoutRounding) {
                    mirage.Point.round(vo);
                }
                return vo;
            }
            return function (finalRect) {
                if (inputs.visible !== true) {
                    return false;
                }
                var childRect = new mirage.Rect();
                if (inputs.useLayoutRounding) {
                    childRect.x = Math.round(finalRect.x);
                    childRect.y = Math.round(finalRect.y);
                    childRect.width = Math.round(finalRect.width);
                    childRect.height = Math.round(finalRect.height);
                }
                else {
                    mirage.Rect.copyTo(finalRect, childRect);
                }
                if (childRect.width < 0 || childRect.height < 0
                    || !isFinite(childRect.width) || !isFinite(childRect.height)
                    || isNaN(childRect.x) || isNaN(childRect.y)
                    || isNaN(childRect.width) || isNaN(childRect.height)) {
                    console.warn("[mirage] cannot call arrange using rect with NaN/infinite values.");
                    return false;
                }
                var doarrange = (state.flags & core.LayoutFlags.arrange) > 0
                    || !mirage.Rect.isEqual(state.layoutSlot, childRect);
                if (!doarrange)
                    return false;
                mirage.Rect.copyTo(childRect, state.layoutSlot);
                mirage.Thickness.shrinkRect(inputs.margin, childRect);
                var offer = calcOffer(childRect);
                var arranged = override(offer);
                state.flags &= ~core.LayoutFlags.arrange;
                if (inputs.useLayoutRounding) {
                    mirage.Size.round(arranged);
                }
                var vo = calcVisualOffset(childRect, arranged);
                if (!mirage.Point.isEqual(vo, state.arrangedSlot) || !mirage.Size.isEqual(arranged, state.arrangedSlot)) {
                    mirage.Rect.copyTo(state.arrangedSlot, state.lastArrangedSlot);
                    state.flags |= core.LayoutFlags.slotHint;
                    tree.propagateFlagUp(core.LayoutFlags.slotHint);
                }
                mirage.Size.copyTo(arranged, state.arrangedSlot);
                mirage.Point.copyTo(vo, state.arrangedSlot);
                return true;
            };
        }
        core.NewArranger = NewArranger;
    })(core = mirage.core || (mirage.core = {}));
})(mirage || (mirage = {}));
var mirage;
(function (mirage) {
    var core;
    (function (core) {
        function DefaultLayoutTree() {
            return {
                parent: null,
                applyTemplate: function () {
                    return true;
                },
                propagateFlagUp: function (flag) {
                    for (var cur = this.parent; !!cur && (cur.state.flags & flag) <= 0; cur = cur.tree.parent) {
                        cur.state.flags |= flag;
                    }
                },
                walk: function (reverse) {
                    return {
                        current: undefined,
                        step: function () {
                            return false;
                        },
                    };
                },
            };
        }
        core.DefaultLayoutTree = DefaultLayoutTree;
    })(core = mirage.core || (mirage.core = {}));
})(mirage || (mirage = {}));
var mirage;
(function (mirage) {
    var core;
    (function (core) {
        (function (LayoutFlags) {
            LayoutFlags[LayoutFlags["none"] = 0] = "none";
            LayoutFlags[LayoutFlags["measure"] = 2] = "measure";
            LayoutFlags[LayoutFlags["arrange"] = 4] = "arrange";
            LayoutFlags[LayoutFlags["measureHint"] = 8] = "measureHint";
            LayoutFlags[LayoutFlags["arrangeHint"] = 16] = "arrangeHint";
            LayoutFlags[LayoutFlags["slotHint"] = 32] = "slotHint";
            LayoutFlags[LayoutFlags["hints"] = 56] = "hints";
        })(core.LayoutFlags || (core.LayoutFlags = {}));
        var LayoutFlags = core.LayoutFlags;
    })(core = mirage.core || (mirage.core = {}));
})(mirage || (mirage = {}));
/// <reference path="converters" />
var mirage;
(function (mirage) {
    var core;
    (function (core) {
        mirage.map.registerNormal("visible", "visible");
        mirage.map.registerNormal("use-layout-rounding", "useLayoutRounding");
        mirage.map.registerNormal("margin", "margin");
        mirage.map.registerNormal("width", "width");
        mirage.map.registerNormal("height", "height");
        mirage.map.registerNormal("min-width", "minWidth");
        mirage.map.registerNormal("min-height", "minHeight");
        mirage.map.registerNormal("max-width", "maxWidth");
        mirage.map.registerNormal("max-height", "maxHeight");
        mirage.map.registerNormal("horizontal-alignment", "horizontalAlignment");
        mirage.map.registerNormal("vertical-alignment", "verticalAlignment");
    })(core = mirage.core || (mirage.core = {}));
})(mirage || (mirage = {}));
var mirage;
(function (mirage) {
    var core;
    (function (core) {
        function NewMeasurer(inputs, state, tree, override) {
            return function (availableSize) {
                if (isNaN(availableSize.width) || isNaN(availableSize.height)) {
                    console.warn("[mirage] cannot call measure using a size with NaN values.");
                    return false;
                }
                if (inputs.visible !== true) {
                    return false;
                }
                var domeasure = (state.flags & core.LayoutFlags.measure) > 0;
                var last = state.lastAvailable;
                domeasure = domeasure || (mirage.Size.isUndef(last) || !mirage.Size.isEqual(last, availableSize));
                mirage.Size.copyTo(availableSize, last);
                tree.applyTemplate();
                if (!domeasure)
                    return false;
                state.flags |= (core.LayoutFlags.arrange | core.LayoutFlags.arrangeHint);
                tree.propagateFlagUp(core.LayoutFlags.arrangeHint);
                var framedSize = new mirage.Size(availableSize.width, availableSize.height);
                mirage.Thickness.shrinkSize(inputs.margin, framedSize);
                core.coerceSize(framedSize, inputs);
                var desired = override(framedSize);
                state.flags &= ~core.LayoutFlags.measure;
                mirage.Size.copyTo(desired, state.hiddenDesire);
                core.coerceSize(desired, inputs);
                mirage.Thickness.growSize(inputs.margin, desired);
                desired.width = Math.min(desired.width, availableSize.width);
                desired.height = Math.min(desired.height, availableSize.height);
                if (inputs.useLayoutRounding) {
                    mirage.Size.round(desired);
                }
                var change = !mirage.Size.isEqual(desired, state.desiredSize);
                mirage.Size.copyTo(desired, state.desiredSize);
                return change;
            };
        }
        core.NewMeasurer = NewMeasurer;
    })(core = mirage.core || (mirage.core = {}));
})(mirage || (mirage = {}));
var mirage;
(function (mirage) {
    var core;
    (function (core) {
        function coerceSize(size, inputs) {
            var cw = Math.max(inputs.minWidth, size.width);
            var ch = Math.max(inputs.minHeight, size.height);
            if (!isNaN(inputs.width))
                cw = inputs.width;
            if (!isNaN(inputs.height))
                ch = inputs.height;
            cw = Math.max(Math.min(cw, inputs.maxWidth), inputs.minWidth);
            ch = Math.max(Math.min(ch, inputs.maxHeight), inputs.minHeight);
            if (inputs.useLayoutRounding) {
                cw = Math.round(cw);
                ch = Math.round(ch);
            }
            size.width = cw;
            size.height = ch;
        }
        core.coerceSize = coerceSize;
    })(core = mirage.core || (mirage.core = {}));
})(mirage || (mirage = {}));
/// <reference path="../core/LayoutFlags" />
var mirage;
(function (mirage) {
    var draft;
    (function (draft) {
        var LayoutFlags = mirage.core.LayoutFlags;
        function NewArrangeDrafter(node) {
            var arrangeList = [];
            return {
                flush: function () {
                    var cur;
                    while ((cur = arrangeList.shift()) != null) {
                        cur.tree.propagateFlagUp(LayoutFlags.arrangeHint);
                    }
                },
                prepare: function () {
                    for (var walker = node.walkDeep(); walker.step();) {
                        var cur = walker.current;
                        if (!cur.inputs.visible) {
                            walker.skipBranch();
                            continue;
                        }
                        if ((cur.state.flags & LayoutFlags.arrangeHint) === 0) {
                            walker.skipBranch();
                            continue;
                        }
                        cur.state.flags &= ~LayoutFlags.arrangeHint;
                        if ((cur.state.flags & LayoutFlags.arrange) > 0) {
                            arrangeList.push(cur);
                        }
                    }
                    return arrangeList.length > 0;
                },
                draft: function (rootSize) {
                    var cur;
                    while ((cur = arrangeList.shift()) != null) {
                        cur.doArrange(rootSize);
                    }
                    return true;
                },
            };
        }
        draft.NewArrangeDrafter = NewArrangeDrafter;
    })(draft = mirage.draft || (mirage.draft = {}));
})(mirage || (mirage = {}));
/// <reference path="../core/LayoutFlags" />
var mirage;
(function (mirage) {
    var draft;
    (function (draft) {
        var LayoutFlags = mirage.core.LayoutFlags;
        var MAX_COUNT = 255;
        function NewDrafter(node) {
            var measure = draft.NewMeasureDrafter(node);
            var arrange = draft.NewArrangeDrafter(node);
            var slot = draft.NewSlotDrafter(node);
            function runDraft(updater, rootSize) {
                if (!node.inputs.visible)
                    return false;
                arrange.flush();
                slot.flush();
                var flags = node.state.flags;
                if ((flags & LayoutFlags.measureHint) > 0) {
                    return measure.prepare()
                        && measure.draft(rootSize);
                }
                if ((flags & LayoutFlags.arrangeHint) > 0) {
                    return arrange.prepare()
                        && arrange.draft(rootSize);
                }
                if ((flags & LayoutFlags.slotHint) > 0) {
                    return slot.prepare()
                        && slot.draft()
                        && slot.notify(updater);
                }
                return false;
            }
            return function (updater, rootSize) {
                if ((node.state.flags & LayoutFlags.hints) === 0)
                    return false;
                var updated = false;
                var count = 0;
                for (; count < MAX_COUNT; count++) {
                    if (!runDraft(updater, rootSize))
                        break;
                    updated = true;
                }
                if (count >= MAX_COUNT) {
                    console.error("[mirage] aborting infinite draft");
                }
                return updated;
            };
        }
        draft.NewDrafter = NewDrafter;
    })(draft = mirage.draft || (mirage.draft = {}));
})(mirage || (mirage = {}));
/// <reference path="../core/LayoutFlags" />
var mirage;
(function (mirage) {
    var draft;
    (function (draft) {
        var LayoutFlags = mirage.core.LayoutFlags;
        function NewMeasureDrafter(node) {
            var measureList = [];
            return {
                prepare: function () {
                    for (var walker = node.walkDeep(); walker.step();) {
                        var cur = walker.current;
                        if (!cur.inputs.visible) {
                            walker.skipBranch();
                            continue;
                        }
                        if ((cur.state.flags & LayoutFlags.measureHint) === 0) {
                            walker.skipBranch();
                            continue;
                        }
                        cur.state.flags &= ~LayoutFlags.measureHint;
                        if ((cur.state.flags & LayoutFlags.measure) > 0) {
                            measureList.push(cur);
                        }
                    }
                    return measureList.length > 0;
                },
                draft: function (rootSize) {
                    var cur;
                    while ((cur = measureList.shift()) != null) {
                        cur.doMeasure(rootSize);
                    }
                    return true;
                },
            };
        }
        draft.NewMeasureDrafter = NewMeasureDrafter;
    })(draft = mirage.draft || (mirage.draft = {}));
})(mirage || (mirage = {}));
/// <reference path="../core/LayoutFlags" />
var mirage;
(function (mirage) {
    var draft;
    (function (draft) {
        var LayoutFlags = mirage.core.LayoutFlags;
        function NewSlotDrafter(node) {
            var slotList = [];
            var slotUpdates = [];
            return {
                flush: function () {
                    var cur;
                    while ((cur = slotList.shift()) != null) {
                        cur.tree.propagateFlagUp(LayoutFlags.slotHint);
                    }
                },
                prepare: function () {
                    for (var walker = node.walkDeep(); walker.step();) {
                        var cur = walker.current;
                        if (!cur.inputs.visible) {
                            walker.skipBranch();
                            continue;
                        }
                        if ((cur.state.flags & LayoutFlags.slotHint) === 0) {
                            walker.skipBranch();
                            continue;
                        }
                        cur.state.flags &= ~LayoutFlags.slotHint;
                        if (!mirage.Rect.isUndef(cur.state.lastArrangedSlot)) {
                            slotList.push(cur);
                        }
                    }
                    return slotList.length > 0;
                },
                draft: function () {
                    var oldRect = new mirage.Rect();
                    var newRect = new mirage.Rect();
                    var cur;
                    while ((cur = slotList.pop()) != null) {
                        cur.slot(oldRect, newRect);
                        if (!mirage.Rect.isEqual(oldRect, newRect)) {
                            slotUpdates.push({
                                node: cur,
                                oldRect: oldRect,
                                newRect: newRect,
                            });
                            oldRect = new mirage.Rect();
                            newRect = new mirage.Rect();
                        }
                    }
                    return slotUpdates.length > 0;
                },
                notify: function (updater) {
                    updater.updateSlots(slotUpdates);
                    return true;
                }
            };
        }
        draft.NewSlotDrafter = NewSlotDrafter;
    })(draft = mirage.draft || (mirage.draft = {}));
})(mirage || (mirage = {}));
var mirage;
(function (mirage) {
    var grid;
    (function (grid) {
        function NewGridArrangeOverride(inputs, state, tree) {
            var des = state.design.arrange;
            return function (arrangeSize) {
                des.init(arrangeSize, inputs.columnDefinitions, inputs.rowDefinitions);
                var cr = new mirage.Rect();
                for (var walker = tree.walk(); walker.step();) {
                    var child = walker.current;
                    des.calcChildRect(cr, child);
                    child.arrange(cr);
                }
                return new mirage.Size(arrangeSize.width, arrangeSize.height);
            };
        }
        grid.NewGridArrangeOverride = NewGridArrangeOverride;
    })(grid = mirage.grid || (mirage.grid = {}));
})(mirage || (mirage = {}));
var mirage;
(function (mirage) {
    var grid;
    (function (grid) {
        function NewGridMeasureOverride(inputs, state, tree) {
            var des = state.design.measure;
            var overrideAutoAuto = grid.design.NewMeasureOverridePass(grid.design.MeasureOverridePass.autoAuto, des, tree);
            var overrideStarAuto = grid.design.NewMeasureOverridePass(grid.design.MeasureOverridePass.starAuto, des, tree);
            var overrideAutoStar = grid.design.NewMeasureOverridePass(grid.design.MeasureOverridePass.autoStar, des, tree);
            var overrideStarAuto2 = grid.design.NewMeasureOverridePass(grid.design.MeasureOverridePass.starAutoAgain, des, tree);
            var overrideNonStar = grid.design.NewMeasureOverridePass(grid.design.MeasureOverridePass.nonStar, des, tree);
            var overrideRemainingStar = grid.design.NewMeasureOverridePass(grid.design.MeasureOverridePass.remainingStar, des, tree);
            return function (constraint) {
                des.init(inputs.columnDefinitions, inputs.rowDefinitions, tree);
                overrideAutoAuto(constraint);
                overrideStarAuto(constraint);
                overrideAutoStar(constraint);
                overrideStarAuto2(constraint);
                overrideNonStar(constraint);
                overrideRemainingStar(constraint);
                des.finish();
                return des.getDesired();
            };
        }
        grid.NewGridMeasureOverride = NewGridMeasureOverride;
    })(grid = mirage.grid || (mirage.grid = {}));
})(mirage || (mirage = {}));
var mirage;
(function (mirage) {
    var logging;
    (function (logging) {
        function NewConsoleLogger(getNodeDescriptor) {
            var curindent = "";
            function indent() {
                curindent += "  ";
            }
            function unindent() {
                curindent = curindent.substr(0, curindent.length - 2);
            }
            getNodeDescriptor = getNodeDescriptor || function (node) {
                var type = node.constructor;
                return "" + type.name;
            };
            return {
                doMeasure: function (node) {
                    console.log("[do-measure]");
                },
                measure: function (node, constraint) {
                    console.log("" + curindent + getNodeDescriptor(node) + " => (" + constraint.width + " " + constraint.height + ") [measure]");
                    indent();
                },
                finishMeasure: function (node) {
                    unindent();
                    var desired = node.state.desiredSize;
                    console.log("" + curindent + getNodeDescriptor(node) + " <= (" + desired.width + " " + desired.height + ") [finish-measure]");
                },
                doArrange: function (node) {
                    console.log("[do-arrange]");
                },
                arrange: function (node, final) {
                    console.log("" + curindent + getNodeDescriptor(node) + " => (" + final.x + " " + final.y + " " + final.width + " " + final.height + ") [arrange]");
                    indent();
                },
                finishArrange: function (node) {
                    unindent();
                    var slot = node.state.arrangedSlot;
                    console.log("" + curindent + getNodeDescriptor(node) + " <= (" + slot.x + " " + slot.y + " " + slot.width + " " + slot.height + ") [finish-arrange]");
                },
            };
        }
        logging.NewConsoleLogger = NewConsoleLogger;
    })(logging = mirage.logging || (mirage.logging = {}));
})(mirage || (mirage = {}));
var mirage;
(function (mirage) {
    var logging;
    (function (logging) {
        function NewNoLogger() {
            return {
                doMeasure: function (node) {
                },
                measure: function (node, constraint) {
                },
                finishMeasure: function (node) {
                },
                doArrange: function (node) {
                },
                arrange: function (node, finalRect) {
                },
                finishArrange: function (node) {
                },
            };
        }
        logging.NewNoLogger = NewNoLogger;
    })(logging = mirage.logging || (mirage.logging = {}));
})(mirage || (mirage = {}));
/// <reference path="NoLogger" />
var mirage;
(function (mirage) {
    mirage.logger = mirage.logging.NewNoLogger();
})(mirage || (mirage = {}));
var mirage;
(function (mirage) {
    var grid;
    (function (grid) {
        var design;
        (function (design) {
            function NewGridArrangeDesign(cm, rm) {
                return {
                    init: function (arrangeSize, coldefs, rowdefs) {
                        originalToOffered(cm);
                        originalToOffered(rm);
                        var consumed = new mirage.Size(design.helpers.calcDesiredToOffered(cm), design.helpers.calcDesiredToOffered(rm));
                        if (consumed.width !== arrangeSize.width) {
                            design.helpers.expand(arrangeSize.width, cm);
                        }
                        if (consumed.height !== arrangeSize.height) {
                            design.helpers.expand(arrangeSize.height, rm);
                        }
                        if (!!coldefs) {
                            for (var i = 0; i < coldefs.length; i++) {
                                coldefs[i].setActualWidth(cm[i][i].offered);
                            }
                        }
                        if (!!rowdefs) {
                            for (var i = 0; i < rowdefs.length; i++) {
                                rowdefs[i].setActualHeight(rm[i][i].offered);
                            }
                        }
                    },
                    calcChildRect: function (childRect, child) {
                        mirage.Rect.clear(childRect);
                        var col = mirage.Grid.getColumn(child) || 0;
                        col = Math.min(col, cm.length - 1);
                        var colspan = mirage.Grid.getColumnSpan(child);
                        if (colspan !== 0)
                            colspan = colspan || 1;
                        colspan = Math.min(colspan, cm.length - col);
                        var row = mirage.Grid.getRow(child) || 0;
                        row = Math.min(row, rm.length - 1);
                        var rowspan = mirage.Grid.getRowSpan(child);
                        if (rowspan !== 0)
                            rowspan = rowspan || 1;
                        rowspan = Math.min(rowspan, rm.length - row);
                        for (var i = 0; i < col; i++) {
                            childRect.x += cm[i][i].offered;
                        }
                        for (var i = col; i < col + colspan; i++) {
                            childRect.width += cm[i][i].offered;
                        }
                        for (var i = 0; i < row; i++) {
                            childRect.y += rm[i][i].offered;
                        }
                        for (var i = row; i < row + rowspan; i++) {
                            childRect.height += rm[i][i].offered;
                        }
                    },
                };
            }
            design.NewGridArrangeDesign = NewGridArrangeDesign;
            function originalToOffered(matrix) {
                for (var i = 0; i < matrix.length; i++) {
                    for (var j = 0; j <= i; j++) {
                        matrix[i][j].offered = matrix[i][j].original;
                    }
                }
            }
        })(design = grid.design || (grid.design = {}));
    })(grid = mirage.grid || (mirage.grid = {}));
})(mirage || (mirage = {}));
var mirage;
(function (mirage) {
    var grid;
    (function (grid) {
        var design;
        (function (design) {
            function NewGridChildShape() {
                var starRow = false;
                var autoRow = false;
                var starCol = false;
                var autoCol = false;
                var col = 0;
                var row = 0;
                var colspan = 1;
                var rowspan = 1;
                var dopass = design.MeasureOverridePass.autoAuto;
                function getConstraintInitialSize(pass, gridHasAutoStar) {
                    switch (pass) {
                        case design.MeasureOverridePass.autoAuto:
                            return new mirage.Size(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
                        case design.MeasureOverridePass.starAuto:
                            return new mirage.Size(Number.POSITIVE_INFINITY, gridHasAutoStar ? Number.POSITIVE_INFINITY : 0);
                        case design.MeasureOverridePass.starAutoAgain:
                            return new mirage.Size(Number.POSITIVE_INFINITY, 0);
                        case design.MeasureOverridePass.autoStar:
                            return new mirage.Size(0, Number.POSITIVE_INFINITY);
                        case design.MeasureOverridePass.nonStar:
                            return new mirage.Size(autoCol ? Number.POSITIVE_INFINITY : 0, autoRow ? Number.POSITIVE_INFINITY : 0);
                    }
                    return new mirage.Size();
                }
                return {
                    col: 0,
                    row: 0,
                    colspan: 1,
                    rowspan: 1,
                    hasAutoAuto: false,
                    hasStarAuto: false,
                    hasAutoStar: false,
                    init: function (child, cm, rm) {
                        col = Math.min(Math.max(0, mirage.Grid.getColumn(child) || 0), cm.length - 1);
                        row = Math.min(Math.max(0, mirage.Grid.getRow(child) || 0), rm.length - 1);
                        colspan = Math.min(Math.max(1, mirage.Grid.getColumnSpan(child) || 0), cm.length - col);
                        rowspan = Math.min(Math.max(1, mirage.Grid.getRowSpan(child) || 0), cm.length - col);
                        this.col = col;
                        this.row = row;
                        this.colspan = colspan;
                        this.rowspan = rowspan;
                        starRow = autoRow = starCol = autoCol = false;
                        for (var i = row; i < row + rowspan; i++) {
                            starRow = starRow || (rm[i][i].type === mirage.GridUnitType.star);
                            autoRow = autoRow || (rm[i][i].type === mirage.GridUnitType.auto);
                        }
                        for (var i = col; i < col + colspan; i++) {
                            starCol = starCol || (cm[i][i].type === mirage.GridUnitType.star);
                            autoCol = autoCol || (cm[i][i].type === mirage.GridUnitType.auto);
                        }
                        this.hasAutoAuto = autoRow && autoCol && !starRow && !starCol;
                        this.hasStarAuto = starRow && autoCol;
                        this.hasAutoStar = autoRow && starCol;
                        if (autoRow && autoCol && !starRow && !starCol) {
                            dopass = design.MeasureOverridePass.autoAuto;
                        }
                        else if (starRow && autoCol && !starCol) {
                            dopass = design.MeasureOverridePass.starAuto;
                        }
                        else if (autoRow && starCol && !starRow) {
                            dopass = design.MeasureOverridePass.autoStar;
                        }
                        else if (!(starRow || starCol)) {
                            dopass = design.MeasureOverridePass.nonStar;
                        }
                        else {
                            dopass = design.MeasureOverridePass.remainingStar;
                        }
                    },
                    shouldMeasurePass: function (pass) {
                        return dopass === pass
                            || (pass === design.MeasureOverridePass.starAutoAgain && dopass === design.MeasureOverridePass.starAuto);
                    },
                    calcConstraint: function (pass, gridHasAutoStar, cm, rm) {
                        var childSize = getConstraintInitialSize(pass, gridHasAutoStar);
                        for (var i = col; i < col + colspan; i++) {
                            childSize.width += cm[i][i].offered;
                        }
                        for (var i = row; i < row + rowspan; i++) {
                            childSize.height += rm[i][i].offered;
                        }
                        return childSize;
                    },
                };
            }
            design.NewGridChildShape = NewGridChildShape;
        })(design = grid.design || (grid.design = {}));
    })(grid = mirage.grid || (mirage.grid = {}));
})(mirage || (mirage = {}));
var mirage;
(function (mirage) {
    var grid;
    (function (grid) {
        var design;
        (function (design) {
            function NewGridPlacement(cm, rm) {
                var unicells = [];
                var multicells = [];
                return {
                    init: function () {
                        unicells.length = 0;
                        multicells.length = 0;
                    },
                    add: function (isRow, start, span, size) {
                        var item = {
                            matrix: isRow ? rm : cm,
                            start: start,
                            end: start + span - 1,
                            size: size,
                        };
                        if (item.start === item.end) {
                            unicells.unshift(item);
                        }
                        else {
                            multicells.push(item);
                        }
                    },
                    allocate: function (allocFunc) {
                        var cell;
                        while ((cell = unicells.pop()) != null) {
                            var i = cell.end;
                            var j = cell.start;
                            cell.matrix[i][j].desired = Math.max(cell.matrix[i][j].desired, cell.size);
                            allocFunc();
                        }
                        while ((cell = multicells.pop()) != null) {
                            var i = cell.end;
                            var j = cell.start;
                            cell.matrix[i][j].desired = Math.max(cell.matrix[i][j].desired, cell.size);
                            allocFunc();
                        }
                    },
                };
            }
            design.NewGridPlacement = NewGridPlacement;
        })(design = grid.design || (grid.design = {}));
    })(grid = mirage.grid || (mirage.grid = {}));
})(mirage || (mirage = {}));
var mirage;
(function (mirage) {
    var grid;
    (function (grid) {
        var design;
        (function (design) {
            var helpers;
            (function (helpers) {
                function expand(available, mat) {
                    for (var i = 0; i < mat.length; i++) {
                        var cur = mat[i][i];
                        if (cur.type === mirage.GridUnitType.star)
                            cur.offered = 0;
                        else
                            available = Math.max(available - cur.offered, 0);
                    }
                    assignSize(mat, 0, mat.length - 1, available, mirage.GridUnitType.star, false);
                }
                helpers.expand = expand;
                function assignSize(mat, start, end, size, unitType, desiredSize) {
                    var count = 0;
                    var assigned = false;
                    var segmentSize = 0;
                    for (var i = start; i <= end; i++) {
                        var cur = mat[i][i];
                        segmentSize = desiredSize ? cur.desired : cur.offered;
                        if (segmentSize < cur.max)
                            count += (unitType === mirage.GridUnitType.star) ? cur.stars : 1;
                    }
                    do {
                        assigned = false;
                        var contribution = size / count;
                        for (var i = start; i <= end; i++) {
                            var cur = mat[i][i];
                            segmentSize = desiredSize ? cur.desired : cur.offered;
                            if (!(cur.type === unitType && segmentSize < cur.max))
                                continue;
                            var newSize = segmentSize;
                            newSize += contribution * (unitType === mirage.GridUnitType.star ? cur.stars : 1);
                            newSize = Math.min(newSize, cur.max);
                            assigned = assigned || (newSize > segmentSize);
                            size -= newSize - segmentSize;
                            if (desiredSize)
                                cur.desired = newSize;
                            else
                                cur.offered = newSize;
                        }
                    } while (assigned);
                    return size;
                }
                helpers.assignSize = assignSize;
                function calcDesiredToOffered(matrix) {
                    var total = 0;
                    for (var i = 0; i < matrix.length; i++) {
                        total += (matrix[i][i].offered = matrix[i][i].desired);
                    }
                    return total;
                }
                helpers.calcDesiredToOffered = calcDesiredToOffered;
            })(helpers = design.helpers || (design.helpers = {}));
        })(design = grid.design || (grid.design = {}));
    })(grid = mirage.grid || (mirage.grid = {}));
})(mirage || (mirage = {}));
var mirage;
(function (mirage) {
    var grid;
    (function (grid) {
        var design;
        (function (design) {
            function NewGridDesign() {
                var cm = [];
                var rm = [];
                return {
                    measure: design.NewGridMeasureDesign(cm, rm),
                    arrange: design.NewGridArrangeDesign(cm, rm),
                };
            }
            design.NewGridDesign = NewGridDesign;
        })(design = grid.design || (grid.design = {}));
    })(grid = mirage.grid || (mirage.grid = {}));
})(mirage || (mirage = {}));
var mirage;
(function (mirage) {
    var grid;
    (function (grid) {
        var design;
        (function (design) {
            function NewGridMeasureDesign(cm, rm) {
                var gridHasAutoStar = false;
                var childShapes = [];
                var placement = design.NewGridPlacement(cm, rm);
                return {
                    init: function (coldefs, rowdefs, tree) {
                        ensureMatrix(cm, !coldefs ? 1 : coldefs.length || 1);
                        ensureMatrix(rm, !rowdefs ? 1 : rowdefs.length || 1);
                        prepareCols(cm, coldefs);
                        prepareRows(rm, rowdefs);
                        syncChildShapes(childShapes, tree, cm, rm);
                        gridHasAutoStar = doesGridHaveAutoStar(childShapes);
                        placement.init();
                    },
                    beginPass: function (constraint) {
                        if (childShapes.length > 0) {
                            design.helpers.expand(constraint.width, cm);
                            design.helpers.expand(constraint.height, rm);
                        }
                    },
                    measureChild: function (pass, index, child) {
                        var childShape = childShapes[index];
                        if (!childShape || !childShape.shouldMeasurePass(pass))
                            return;
                        child.measure(childShape.calcConstraint(pass, gridHasAutoStar, cm, rm));
                        var desired = child.state.desiredSize;
                        if (pass !== design.MeasureOverridePass.starAuto)
                            placement.add(true, childShape.row, childShape.rowspan, desired.height);
                        placement.add(false, childShape.col, childShape.colspan, desired.width);
                    },
                    endPass: function () {
                        placement.allocate(allocateDesiredSizeFunc(cm, rm));
                    },
                    finish: function () {
                        for (var i = 0; i < cm.length; i++) {
                            for (var j = 0; j <= i; j++) {
                                cm[i][j].original = cm[i][j].offered;
                            }
                        }
                        for (var i = 0; i < rm.length; i++) {
                            for (var j = 0; j <= i; j++) {
                                rm[i][j].original = rm[i][j].offered;
                            }
                        }
                    },
                    getDesired: function () {
                        var desired = new mirage.Size();
                        for (var i = 0; i < cm.length; i++) {
                            desired.width += cm[i][i].desired;
                        }
                        for (var i = 0; i < rm.length; i++) {
                            desired.height += rm[i][i].desired;
                        }
                        return desired;
                    },
                };
            }
            design.NewGridMeasureDesign = NewGridMeasureDesign;
            var DEFAULT_GRID_LEN = {
                value: 1.0,
                type: mirage.GridUnitType.star
            };
            function ensureMatrix(matrix, defCount) {
                if (matrix.length > defCount)
                    matrix.splice(defCount, matrix.length - defCount);
                for (var i = 0; i < defCount; i++) {
                    if (matrix.length <= i)
                        matrix.push([]);
                    var mrow = matrix[i];
                    if (mrow.length > (i + 1))
                        mrow.splice(i, mrow.length - i - 1);
                    for (var ii = 0; ii <= i; ii++) {
                        if (mrow.length <= ii)
                            mrow.push(new design.Segment());
                        else
                            design.Segment.init(mrow[ii]);
                    }
                }
            }
            function prepareCols(cm, coldefs) {
                if (!coldefs || coldefs.length === 0) {
                    var mcell = cm[0][0];
                    mcell.type = mirage.GridUnitType.star;
                    mcell.stars = 1.0;
                    return;
                }
                for (var i = 0; i < coldefs.length; i++) {
                    var colDef = coldefs[i];
                    var width = colDef.width || DEFAULT_GRID_LEN;
                    var cell = design.Segment.init(cm[i][i], 0.0, colDef.minWidth, colDef.maxWidth, width.type);
                    if (width.type === mirage.GridUnitType.pixel) {
                        cell.desired = cell.offered = cell.clamp(width.value);
                    }
                    else if (width.type === mirage.GridUnitType.star) {
                        cell.stars = width.value;
                    }
                    else if (width.type === mirage.GridUnitType.auto) {
                        cell.desired = cell.offered = cell.clamp(0);
                    }
                }
            }
            function prepareRows(rm, rowdefs) {
                if (!rowdefs || rowdefs.length === 0) {
                    var mcell = rm[0][0];
                    mcell.type = mirage.GridUnitType.star;
                    mcell.stars = 1.0;
                    return;
                }
                for (var i = 0; i < rowdefs.length; i++) {
                    var rowDef = rowdefs[i];
                    var height = rowDef.height || DEFAULT_GRID_LEN;
                    var cell = design.Segment.init(rm[i][i], 0.0, rowDef.minHeight, rowDef.maxHeight, height.type);
                    if (height.type === mirage.GridUnitType.pixel) {
                        cell.desired = cell.offered = cell.clamp(height.value);
                    }
                    else if (height.type === mirage.GridUnitType.star) {
                        cell.stars = height.value;
                    }
                    else if (height.type === mirage.GridUnitType.auto) {
                        cell.desired = cell.offered = cell.clamp(0);
                    }
                }
            }
            function syncChildShapes(childShapes, tree, cm, rm) {
                var i = 0;
                for (var walker = tree.walk(); walker.step(); i++) {
                    var childShape = void 0;
                    if (i < childShapes.length) {
                        childShape = childShapes[i] = childShapes[i] || design.NewGridChildShape();
                    }
                    else {
                        childShapes.push(childShape = design.NewGridChildShape());
                    }
                    childShape.init(walker.current, cm, rm);
                }
                if (i < childShapes.length)
                    childShapes.slice(i, childShapes.length - i);
            }
            function allocateDesiredSizeFunc(cm, rm) {
                function hasStarInSpan(mat, start, end) {
                    var spansStar = false;
                    for (var i = start; i >= end; i--) {
                        spansStar = spansStar || mat[i][i].type === mirage.GridUnitType.star;
                    }
                    return spansStar;
                }
                function calcDesired(mat, start, end) {
                    var total = 0;
                    for (var i = start; i >= end; i--) {
                        total += mat[i][i].desired;
                    }
                    return total;
                }
                function allocSegments(mat) {
                    var count = mat.length;
                    for (var start = count - 1; start >= 0; start--) {
                        for (var end = start; end >= 0; end--) {
                            var hasStar = hasStarInSpan(mat, start, end);
                            var cur = mat[start][end].desired;
                            var total = calcDesired(mat, start, end);
                            var additional = cur - total;
                            if (additional > 0) {
                                if (hasStar) {
                                    design.helpers.assignSize(mat, end, start, additional, mirage.GridUnitType.star, true);
                                }
                                else {
                                    design.helpers.assignSize(mat, end, start, additional, mirage.GridUnitType.pixel, true);
                                    design.helpers.assignSize(mat, end, start, additional, mirage.GridUnitType.auto, true);
                                }
                            }
                        }
                    }
                }
                return function () {
                    allocSegments(rm);
                    allocSegments(cm);
                    design.helpers.calcDesiredToOffered(rm);
                    design.helpers.calcDesiredToOffered(cm);
                };
            }
            function doesGridHaveAutoStar(childShapes) {
                for (var i = 0; i < childShapes.length; i++) {
                    if (childShapes[i].hasAutoStar)
                        return true;
                }
                return false;
            }
        })(design = grid.design || (grid.design = {}));
    })(grid = mirage.grid || (mirage.grid = {}));
})(mirage || (mirage = {}));
var mirage;
(function (mirage) {
    var grid;
    (function (grid) {
        var design;
        (function (design) {
            (function (MeasureOverridePass) {
                MeasureOverridePass[MeasureOverridePass["autoAuto"] = 0] = "autoAuto";
                MeasureOverridePass[MeasureOverridePass["starAuto"] = 1] = "starAuto";
                MeasureOverridePass[MeasureOverridePass["autoStar"] = 2] = "autoStar";
                MeasureOverridePass[MeasureOverridePass["starAutoAgain"] = 3] = "starAutoAgain";
                MeasureOverridePass[MeasureOverridePass["nonStar"] = 4] = "nonStar";
                MeasureOverridePass[MeasureOverridePass["remainingStar"] = 5] = "remainingStar";
            })(design.MeasureOverridePass || (design.MeasureOverridePass = {}));
            var MeasureOverridePass = design.MeasureOverridePass;
            function NewMeasureOverridePass(pass, des, tree) {
                return function (constraint) {
                    des.beginPass(constraint);
                    for (var walker = tree.walk(), i = 0; walker.step(); i++) {
                        des.measureChild(pass, i, walker.current);
                    }
                    des.endPass();
                };
            }
            design.NewMeasureOverridePass = NewMeasureOverridePass;
        })(design = grid.design || (grid.design = {}));
    })(grid = mirage.grid || (mirage.grid = {}));
})(mirage || (mirage = {}));
var mirage;
(function (mirage) {
    var grid;
    (function (grid) {
        var design;
        (function (design) {
            var Segment = (function () {
                function Segment() {
                    this.desired = 0.0;
                    this.offered = 0.0;
                    this.original = 0.0;
                    this.min = 0.0;
                    this.max = Number.POSITIVE_INFINITY;
                    this.stars = 0;
                    this.type = mirage.GridUnitType.pixel;
                }
                Segment.prototype.clamp = function (value) {
                    if (value < this.min)
                        return this.min;
                    if (value > this.max)
                        return this.max;
                    return value;
                };
                Segment.init = function (segment, offered, min, max, unitType) {
                    segment.desired = 0.0;
                    segment.stars = 0;
                    segment.offered = offered || 0.0;
                    segment.min = min || 0.0;
                    segment.max = max != null ? max : Number.POSITIVE_INFINITY;
                    segment.type = unitType != null ? unitType : mirage.GridUnitType.pixel;
                    if (segment.offered < min)
                        segment.offered = min;
                    else if (segment.offered > max)
                        segment.offered = max;
                    return segment;
                };
                return Segment;
            })();
            design.Segment = Segment;
        })(design = grid.design || (grid.design = {}));
    })(grid = mirage.grid || (mirage.grid = {}));
})(mirage || (mirage = {}));



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



//# sourceMappingURL=mirage-html.js.map
