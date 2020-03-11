; (function () {
    var babelHelpers; /* istanbul ignore next */babelHelpers = function () {
        var babelHelpers = {};
        babelHelpers; return babelHelpers;
    }();

    /*
     * classList.js: Cross-browser full element.classList implementation.
     * 1.1.20150312
     *
     * By Eli Grey, http://eligrey.com
     * License: Dedicated to the public domain.
     *   See https://github.com/eligrey/classList.js/blob/master/LICENSE.md
     */

    /*global self, document, DOMException */

    /*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js */

    if ("document" in self) {

        // Full polyfill for browsers with no classList support
        // Including IE < Edge missing SVGElement.classList
        if (!("classList" in document.createElement("_")) || document.createElementNS && !("classList" in document.createElementNS("http://www.w3.org/2000/svg", "g"))) {

            (function (view) {

                "use strict";

                if (!('Element' in view)) return;

                var classListProp = "classList",
                    protoProp = "prototype",
                    elemCtrProto = view.Element[protoProp],
                    objCtr = Object,
                    strTrim = String[protoProp].trim || function () {
                        return this.replace(/^\s+|\s+$/g, "");
                    },
                    arrIndexOf = Array[protoProp].indexOf || function (item) {
                        var i = 0,
                            len = this.length;
                        for (; i < len; i++) {
                            if (i in this && this[i] === item) {
                                return i;
                            }
                        }
                        return -1;
                    }
                    // Vendors: please allow content code to instantiate DOMExceptions
                    ,
                    DOMEx = function (type, message) {
                        this.name = type;
                        this.code = DOMException[type];
                        this.message = message;
                    },
                    checkTokenAndGetIndex = function (classList, token) {
                        if (token === "") {
                            throw new DOMEx("SYNTAX_ERR", "An invalid or illegal string was specified");
                        }
                        if (/\s/.test(token)) {
                            throw new DOMEx("INVALID_CHARACTER_ERR", "String contains an invalid character");
                        }
                        return arrIndexOf.call(classList, token);
                    },
                    ClassList = function (elem) {
                        var trimmedClasses = strTrim.call(elem.getAttribute("class") || ""),
                            classes = trimmedClasses ? trimmedClasses.split(/\s+/) : [],
                            i = 0,
                            len = classes.length;
                        for (; i < len; i++) {
                            this.push(classes[i]);
                        }
                        this._updateClassName = function () {
                            elem.setAttribute("class", this.toString());
                        };
                    },
                    classListProto = ClassList[protoProp] = [],
                    classListGetter = function () {
                        return new ClassList(this);
                    };
                // Most DOMException implementations don't allow calling DOMException's toString()
                // on non-DOMExceptions. Error's toString() is sufficient here.
                DOMEx[protoProp] = Error[protoProp];
                classListProto.item = function (i) {
                    return this[i] || null;
                };
                classListProto.contains = function (token) {
                    token += "";
                    return checkTokenAndGetIndex(this, token) !== -1;
                };
                classListProto.add = function () {
                    var tokens = arguments,
                        i = 0,
                        l = tokens.length,
                        token,
                        updated = false;
                    do {
                        token = tokens[i] + "";
                        if (checkTokenAndGetIndex(this, token) === -1) {
                            this.push(token);
                            updated = true;
                        }
                    } while (++i < l);

                    if (updated) {
                        this._updateClassName();
                    }
                };
                classListProto.remove = function () {
                    var tokens = arguments,
                        i = 0,
                        l = tokens.length,
                        token,
                        updated = false,
                        index;
                    do {
                        token = tokens[i] + "";
                        index = checkTokenAndGetIndex(this, token);
                        while (index !== -1) {
                            this.splice(index, 1);
                            updated = true;
                            index = checkTokenAndGetIndex(this, token);
                        }
                    } while (++i < l);

                    if (updated) {
                        this._updateClassName();
                    }
                };
                classListProto.toggle = function (token, force) {
                    token += "";

                    var result = this.contains(token),
                        method = result ? force !== true && "remove" : force !== false && "add";

                    if (method) {
                        this[method](token);
                    }

                    if (force === true || force === false) {
                        return force;
                    } else {
                        return !result;
                    }
                };
                classListProto.toString = function () {
                    return this.join(" ");
                };

                if (objCtr.defineProperty) {
                    var classListPropDesc = {
                        get: classListGetter,
                        enumerable: true,
                        configurable: true
                    };
                    try {
                        objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
                    } catch (ex) {
                        // IE 8 doesn't support enumerable:true
                        if (ex.number === -0x7FF5EC54) {
                            classListPropDesc.enumerable = false;
                            objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
                        }
                    }
                } else if (objCtr[protoProp].__defineGetter__) {
                    elemCtrProto.__defineGetter__(classListProp, classListGetter);
                }
            })(self);
        } else {
            // There is full or partial native classList support, so just check if we need
            // to normalize the add/remove and toggle APIs.

            (function () {
                "use strict";

                var testElement = document.createElement("_");

                testElement.classList.add("c1", "c2");

                // Polyfill for IE 10/11 and Firefox <26, where classList.add and
                // classList.remove exist but support only one argument at a time.
                if (!testElement.classList.contains("c2")) {
                    var createMethod = function (method) {
                        var original = DOMTokenList.prototype[method];

                        DOMTokenList.prototype[method] = function (token) {
                            var i,
                                len = arguments.length;

                            for (i = 0; i < len; i++) {
                                token = arguments[i];
                                original.call(this, token);
                            }
                        };
                    };
                    createMethod('add');
                    createMethod('remove');
                }

                testElement.classList.toggle("c3", false);

                // Polyfill for IE 10 and Firefox <24, where classList.toggle does not
                // support the second argument.
                if (testElement.classList.contains("c3")) {
                    var _toggle = DOMTokenList.prototype.toggle;

                    DOMTokenList.prototype.toggle = function (token, force) {
                        if (1 in arguments && !this.contains(token) === !force) {
                            return force;
                        } else {
                            return _toggle.call(this, token);
                        }
                    };
                }

                testElement = null;
            })();
        }
    }
    (function (globals, _, $, d3, thief) {
        'use strict';

        function transitionEnd(maxLimit) {
            return function (transition, callback) {
                var n = 0;

                transition.on('end', function () {
                    //wait to execute the call back until all the transitions have finished
                    if (++n === maxLimit) {
                        callback.apply(this, arguments);
                    }
                });
            };
        }

        // This is what helps draw the curvy lines
        // x and y are swapped because we're drawing sideways instead of vertically
        //Link lines are drawn by interfacing directly with the line/path format.
        //The below format is from the decision to remove the helper that used to exist, https://github.com/d3/d3-shape/issues/27#issuecomment-227839157
        function getLinkFunc(d) {
            return 'M' + d.source.y + ',' + d.source.x + 'C' + (d.source.y + d.target.y) / 2 + ',' + d.source.x + ' ' + (d.source.y + d.target.y) / 2 + ',' + d.target.x + ' ' + d.target.y + ',' + d.target.x;
        }

        function defaultAddNodeContent(nodeCollection) {
            //The order of which you add things is the order in which they overlap!!!
            nodeCollection.append('rect').classed('minimap-node', true).attr('width', 60).attr('height', 40);

            nodeCollection.append('text').attr('dy', '1em') //move the text one unit of text height down so it's inside the box vertically
                .attr('text-anchor', 'start') //In order for the text to be in the boxes, it needs to be appended at the start
                .attr('fill', 'black') //black is the default but adding it so this attribute isn't inherited so we can actually see it
                .attr('stroke', 'none').text(function (d) {
                    return d.data.name;
                });
        }

        function defaultAddMinimapNodeContent(nodeCollection) {
            //The order of which you add things is the order in which they overlap!!!
            nodeCollection.append('rect').classed('minimap-node', true).attr('width', 60).attr('height', 40);
        }

        var buttonsContainerTemplate = ['<div class="buttons-container">', '<div class="btn btn-icon btn-invisible action-zoom-out">', '<i class="icon-zoom-out"></i>', '</div>', '<div class="btn btn-icon btn-invisible action-zoom-in">', '<i class="icon-zoom-in"></i>', '</div>', '<div class="btn btn-icon btn-invisible pull-right action-zoom-default">', '<i class="icon-refresh"></i>', '</div>', '</div>'];

        function minimapContainerTopTemplate() {
            var topTemplate = ['<div class="minimap-padding-container minimap-top-container">', '<div class="mini-svg-placeholder"></div>', buttonsContainerTemplate.join(''), '</div>', '<div class="btn btn-icon btn-invisible action-toggle" style="display:block;">', '<i class="icon-chevron-up1-s"></i>', '</div>'];
            return topTemplate.join('');
        }

        function minimapContainerBottomTemplate() {
            var bottomTemplate = ['<div class="btn btn-icon btn-invisible action-toggle" style="display:block;">', '<i class="icon-chevron-down1-s"></i>', '</div>', '<div class="minimap-padding-container minimap-bottom-container">', buttonsContainerTemplate.join(''), '<div class="mini-svg-placeholder"></div>', '</div>'];
            return bottomTemplate.join('');
        }

        //true if was clicked, false if was hovered
        function getStyleClasses(isClicked) {
            return {
                emphasizedNodeClass: isClicked ? 'd3-node-emphasized' : 'd3-node-hovered',
                nodeClass: isClicked ? 'd3-node-selected' : 'd3-node-hovered',
                linkClass: isClicked ? 'd3-link-selected' : 'd3-link-hovered'
            };
        }

        var Treeview = function Treeview(treeData, renderTarget, options) {
            if (!_.isPlainObject(treeData) || !_.isString(renderTarget)) {
                console.error('TreeView needs both tree json data and a target el to render into');
                return;
            }

            this.options = {
                animationDuration: 0,
                nodeStyleClass: 'd3-node',
                linkStyleClass: 'd3-link',
                measurements: {
                    nodeHeight: 45, //can be done in css but we need this for link calculations
                    nodeWidth: 150,
                    nodeSiblingPadding: 7,
                    childDistanceFromParent: 180
                },
                fullScreen: false,
                minScaleFactor: 0.5,
                maxScaleFactor: 3,
                treeContainerPadding: 100,
                highlightOnClick: true,
                highlightOnHover: true,
                highlightChildren: true,
                emphasizeSelectedNode: true,
                skipSelectionClass: 'disable-element-highlighting',
                skipDragAndZoomClass: 'disable-drag-zoom-on-element',
                uniqueNodeAttribute: 'name',
                addNodeContentFunction: defaultAddNodeContent, // function of what the nodes actually display inside themselves
                addLinkPropertiesFunction: null,
                respectNodeDimsOnDraw: true, // should node dimensions be taken into account when drawing nodes and links
                dragAndZoomable: true,
                virtualScrolling: true,
                minimap: {
                    show: true,
                    minimize: false,
                    height: 300, //the size of the inner minimap, not the size of the container
                    width: 350, //the container will be these variables * 1.1 large
                    scaleStep: 0.15, //how much we want minimap zoom in/out buttons to change the global scale factor
                    location: 'tr', //tr=top-right, tl=top-left, br=bottom-right, bl=bottom-left
                    nodeStyleClass: 'd3-minimap-node',
                    linkStyleClass: 'd3-minimap-link',
                    addNodeContentFunction: defaultAddMinimapNodeContent, //function of what the minimap nodes should display
                    addLinkPropertiesFunction: null
                }
            };

            //The rest of this function is the contructor. Putting it in its own function is unnecessary and messes up linting.

            _.merge(this.options, options);
            this.renderTarget = renderTarget; //so can access it in other places
            //The tree starts scaled at 1 since _drawNodes and _drawLinks do not use a scale factor so no use in allowing consumers to change it.
            this.startingScale = this.scaleFactor = 1; //save it for resetting

            this.tree = d3.tree().nodeSize([this.options.measurements.nodeHeight + this.options.measurements.nodeSiblingPadding, this.options.measurements.nodeWidth]);
            this._setTreeData(treeData);

            this.addResizeHandler();
        };

        Treeview.prototype = {
            //The tree is only used for layout positioning, the root hierarchy object contains all the needed data
            _setTreeData: function (treeData) {
                this.root = d3.hierarchy(treeData); //puts json in tree node form
                this.tree(this.root); //modifies this.root, gives every node an x and y
            },

            updateTree: function (treeData) {
                this._setTreeData(treeData);
                return this.render();
            },

            _sizeSvgContainer: function () {
                var targetRect = this.$el[0].getBoundingClientRect();

                var height = targetRect.height; //defaults used when there's a set size
                var width = targetRect.width;

                if (this.options.fullScreen) {
                    //fill the screen
                    height = window.innerHeight - targetRect.top - 5; //the 5 is necessary to avoid a vertical scrollbar when resizing in IE, Chrome only needs to subtract 3
                    width = window.innerWidth - targetRect.left;

                    this.$el.height(height);
                    this.$el.width(width);
                }

                return { height: height, width: width };
            },

            //where the tree is contained within the DOM
            //This function needs to be called every time the renderTarget element's
            //size changes. Since render also needs to be called when that happens, this
            //function is called at the start of the render function so the consumer can
            //make fewer function calls.
            _createSvgContainer: function () {
                var size = this._sizeSvgContainer();

                //these things only need to be done once per instance of Treeview
                if (!this.$el.find('.main-tree-container').length) {
                    //need this.svg as a different variable from this.svg.mainTreeContainer so you can set zoom, drag and have the minimap on the svg container
                    this.svg = d3.select(this.renderTarget).classed('consumer-container', true).append('svg').attr('width', '100%').attr('height', '100%');
                    this.$svg = $(this.renderTarget + ' > svg');

                    //mainTreeContainer is where the big tree is contained, the minimap will need to know this
                    this.svg.mainTreeContainer = this.svg.append('g').classed('main-tree-container', true);

                    //finding based on the class attribute b/c of this issue in IE: https://github.com/jquery/sizzle/issues/322
                    this.svg.$mainTreeContainer = this.$svg.find('[class~=main-tree-container]');

                    if (this.options.dragAndZoomable) {
                        this.svg.classed('tf-draggable', true);
                        this._setUpZoomAndDrag();
                    } else {
                        // if the main tree isn't dragAndZoomable, we probably don't want to
                        // display the minimap either as the assumption is that the
                        // main tree is small enough to fully display all the content. We also
                        // remove the resize callback so that if a user manually zooms, they
                        // at least get the automatic scroll capability of the browser
                        this.options.minimap.show = false;
                        this.removeResizeHandler();
                    }
                }

                //need to translate the center since giving nodeSize to tree makes it put the root at (0,0)
                //this will also reset the tree when you pass it new data
                var newY = size.height / 2;
                this._moveScaleMainTree(this.options.treeContainerPadding, newY);

                //the minimap will need to know where you just translated (0,0) (aka the root node) to
                this.svg.mainTreeContainer.rootXCoordinate = this.options.treeContainerPadding;
                this.svg.mainTreeContainer.rootYCoordinate = newY;
            },

            _setUpZoomAndDrag: function () {
                var skipDragAndZoomClass = this.options.skipDragAndZoomClass;
                function filterDragAndZoomEvents() {
                    //classList is a DOMTokenList so you can use contains
                    return !d3.event.target.classList.contains(skipDragAndZoomClass);
                }

                var drag = d3.drag().filter(filterDragAndZoomEvents).on('start.main-tree-container', _.bind(function () {
                    this.$svg[0].classList.add('tf-dragging-inprogress');
                    this.$el.trigger('treeDragStart');
                }, this)).on('end.main-tree-container', _.bind(function () {
                    this.$svg[0].classList.remove('tf-dragging-inprogress');
                    this.$el.trigger('treeDragEnd');
                }, this)).on('drag.main-tree-container', _.bind(function () {
                    //d3.event is a global DOM event
                    d3.event.sourceEvent.stopImmediatePropagation();
                    this._dragHandler(d3.event);
                }, this));

                this.svg.call(drag);

                this.zoom = d3.zoom().scaleExtent([this.options.minScaleFactor, this.options.maxScaleFactor]) //prevents mousewheel scroll events when at the scroll limits
                    .filter(filterDragAndZoomEvents).on('zoom', _.bind(this._zoomHandler, this));

                //add zoom handler but don't zoom on double clicking
                this.svg.call(this.zoom).on('dblclick.zoom', null);
            },

            //This handles dragging in the main tree, not the minimap.
            _dragHandler: function (moveAmount) {
                //calculate the new location of the origin
                //use dx,dy instead of the event's x,y since need the coordinates based on the window's origin, not the svg origin
                var mainTreeContainerX = this.svg.mainTreeContainer.rootXCoordinate + moveAmount.dx;
                var mainTreeContainerY = this.svg.mainTreeContainer.rootYCoordinate + moveAmount.dy;

                //need to coordinate movement with the minimap highlighted box
                if (this.options.minimap.show) {
                    //values passed to _getMaxMinimapMoveAmount is the move amount in minimap scale
                    //negative signs are needed since the minimap's highlighted part needs to move in the opposite direction of the drag
                    //like dragging down makes the highlighted part move up
                    //need the scale factor since when zoomed the dragging coordination between main and mini tree is not 1 to 1
                    var maxMove = this._getMaxMinimapMoveAmount(-moveAmount.dx * this.minimapDiv.minimapContainer.miniTree.wScalingFactor / this.scaleFactor, -moveAmount.dy * this.minimapDiv.minimapContainer.miniTree.hScalingFactor / this.scaleFactor);
                    this._handleMinimapZoomDrag(maxMove);
                } else {
                    //move the main container to the new location
                    //scale is needed when zooming has been used
                    this._moveScaleMainTree(mainTreeContainerX, mainTreeContainerY);
                    this.svg.mainTreeContainer.rootXCoordinate = mainTreeContainerX;
                    this.svg.mainTreeContainer.rootYCoordinate = mainTreeContainerY;
                }

                if (this.options.virtualScrolling) {
                    this._updateVisibleTree();
                }
            },

            //this actually does the zooming
            _zoomHandler: function () {
                //TODO might need to make sure supposed to be zooming and not dragging but haven't run into that use case yet.

                //d3.event is a global DOM event
                this.scaleFactor = d3.event.transform.k;

                if (this.options.minimap.show) {
                    //Move and scale the main tree.  Pass (0,0) so the minimap highlighted part doesn't move, that will be moved in _renderMinimapContainer().
                    //This must come BEFORE _renderMinimapContainer so that the minimap's root coordinates remain the same.
                    //Staying the same will keep it in bounds and prevent jerky looking minimap resizing behavior on zoom
                    this._handleMinimapZoomDrag({ x: 0, y: 0 });
                    this._renderMinimapContainer();
                } else {
                    this._moveScaleMainTree(this.svg.mainTreeContainer.rootXCoordinate, this.svg.mainTreeContainer.rootYCoordinate);
                    if (this.options.virtualScrolling) {
                        this._updateVisibleTree();
                    }
                }
            },

            //how d3 actually does the moving and scaling of the svg
            //Note, there is a D3 function that can return the transform string's value (transform.toString) but since the SVG format is standardized, there's not much benefit to calling another function.
            _moveScaleMainTree: function (xCoor, yCoor) {
                this.svg.mainTreeContainer.attr('transform', 'translate(' + xCoor + ',' + yCoor + ') scale(' + this.scaleFactor + ')');
            },

            //for most of the minimap movements which don't need to scale
            _moveSelector: function (objectToMoveSelector, xCoor, yCoor) {
                objectToMoveSelector.attr('transform', 'translate(' + xCoor + ',' + yCoor + ')');
            },

            //Update which nodes and links are being shown in the window, used when the tree's been moved or scaled.
            _updateVisibleTree: function () {
                var targetRect = this._inViewTargetRect();
                var nodePositionFunction = _.bind(this._translateNode, this);
                this._renderNodesInPosition(nodePositionFunction, targetRect);

                this._renderLinksInPosition(_.bind(this._translateLinkToFinalPosition, this), targetRect);
            },

            //positioning can be a function or a position string
            _renderNodesInPosition: function (positioning, targetRect) {
                var nodes = this.root.descendants();
                var uniqueNodeAttribute = this.options.uniqueNodeAttribute;

                if (this.options.virtualScrolling) {
                    //TODO might be able to pass a subset of nodes to search once https://gitlab.factset.com/dataviz/d3-treeview/issues/9 is implemented.
                    nodes = this._findNodesToShow(nodes, targetRect);
                }

                //This is what D3 calls the update selection, it contains enter and exit selections as well
                //which can be accessed by calling .enter() or .exit()
                var nodeUpdateSelection = this.svg.mainTreeContainer.selectAll('.' + this.options.nodeStyleClass).data(nodes, function (d) {
                    return d.data[uniqueNodeAttribute];
                });

                //Remove nodes that are no longer on screen
                nodeUpdateSelection.exit().remove(); //uses the D3 remove

                //This is what D3 calls the enter selection
                var nodeCollection = nodeUpdateSelection.enter().append('g').attr('class', _.bind(function (d) {
                    return 'd3-node ' + this.options.nodeStyleClass + ' ' + (d.clickClass || '');
                }, this)).attr('id', function (d) {
                    return d.id;
                }).attr('unique-node-value', function (d) {
                    return d.data[uniqueNodeAttribute];
                }).attr('transform', positioning); //the node will automatically be passed by D3 so the positioning can use it if it's a function

                if (_.isFunction(this.options.addNodeContentFunction)) {
                    this.options.addNodeContentFunction(nodeCollection);
                }

                return nodeCollection;
            },

            //positioning can be a function or a position string
            _renderLinksInPosition: function (positioning, targetRect) {
                var links = this.root.links();
                var uniqueNodeAttribute = this.options.uniqueNodeAttribute;

                if (this.options.virtualScrolling) {
                    //TODO might be able to pass a subset of links to search once https://gitlab.factset.com/dataviz/d3-treeview/issues/9 is implemented.
                    links = this._findLinksToShow(links, targetRect);
                }

                //This is what D3 calls the update selection, it contains enter and exit selections as well
                //which can be accessed by calling .enter() or .exit()
                var linkUpdateSelection = this.svg.mainTreeContainer.selectAll('.' + this.options.linkStyleClass).data(links, function (d) {
                    return d.target.data[uniqueNodeAttribute];
                });

                //Remove links that are no longer on screen
                linkUpdateSelection.exit().remove(); //uses the D3 remove

                //This is what D3 calls the enter selection
                var linkCollection = linkUpdateSelection.enter().append('path').attr('class', _.bind(function (d) {
                    return 'd3-link ' + this.options.linkStyleClass + ' ' + (d.target.linkClickClass || '');
                }, this)).attr('id', function (d) {
                    //make the id be link-<node the link ends at>
                    return 'link-to-' + d.target.id;
                }).attr('d', positioning); //the link will automatically be passed by D3 so the positioning can use it if it's a function

                // add user-specified individual link styling
                if (_.isFunction(this.options.addLinkPropertiesFunction)) {
                    this.options.addLinkPropertiesFunction(linkCollection);
                }

                return linkCollection;
            },

            _findNodesToShow: function (allNodes, targetRect) {
                var nodeHeight = this.options.measurements.nodeHeight;
                var nodeWidth = this.options.measurements.nodeWidth;
                var scaleFactor = this.scaleFactor;
                var originalTargetCoor = this.$el[0].getBoundingClientRect(); //this returns a read-only value and corresponds to the coordinates the visible window is using

                var svgRootCoor = {
                    x: this.svg.mainTreeContainer.rootXCoordinate,
                    y: this.svg.mainTreeContainer.rootYCoordinate
                };

                var nodesToShow = [];
                _.each(allNodes, function (node) {
                    //translate the D3 coordinates to the same coordinate system as the targetRect
                    //node's x,y are switched because tree is sideways instead of vertical
                    //node is multipled by the scaleFactor since the node's coordinates aren't changed after creation
                    var targetNodeCoor = {
                        left: originalTargetCoor.left + svgRootCoor.x + node.y * scaleFactor,
                        right: originalTargetCoor.left + svgRootCoor.x + (node.y + nodeWidth) * scaleFactor,
                        top: originalTargetCoor.top + svgRootCoor.y + node.x * scaleFactor,
                        bottom: originalTargetCoor.top + svgRootCoor.y + (node.x + nodeHeight) * scaleFactor
                    };

                    //Every visible node has at least one corner within the bounds.
                    //An in-bound corner is the same thing as two in-bound lines that intersect, so one within bounds horizontally and one in-bounds vertically.
                    //This is simpliest to picture using rectangles but it also works with circles.
                    var bottomInHorizontalBounds = targetNodeCoor.bottom < targetRect.bottom && targetNodeCoor.bottom > targetRect.top;
                    var topInHorizontalBounds = targetNodeCoor.top > targetRect.top && targetNodeCoor.top < targetRect.bottom;

                    var leftInVerticalBounds = targetNodeCoor.left > targetRect.left && targetNodeCoor.left < targetRect.right;
                    var rightInVerticalBounds = targetNodeCoor.right > targetRect.left && targetNodeCoor.right < targetRect.right;

                    if (leftInVerticalBounds && bottomInHorizontalBounds || leftInVerticalBounds && topInHorizontalBounds || rightInVerticalBounds && bottomInHorizontalBounds || rightInVerticalBounds && topInHorizontalBounds) {
                        nodesToShow.push(node);
                    }
                });

                return nodesToShow;
            },

            _findLinksToShow: function (allLinks, targetRect) {
                /*jshint bitwise: false*/
                var nodeWidth = this.options.measurements.nodeWidth;
                var scaleFactor = this.scaleFactor;
                var originalTargetCoor = this.$el[0].getBoundingClientRect(); //this returns a read-only value

                //If the link intersects any of the targetRect boundaries or if either end is contained in the targetRect, then show the link
                //To check if two lines intersect, the endpoints of L1 should be on opposite sides of L2 and the endpoints of L2 should be on opposite sides of L1.
                //Code and solution based on http://stackoverflow.com/a/3842240
                //Check the orientation of point C to line AB.
                //Returns 0 if points are collinear, <0 if C is to the right of AB, and >0 if C is to the left of AB
                function side(a, b, c) {
                    return (b.x - a.x) * (c.y - a.y) - (c.x - a.x) * (b.y - a.y);
                }

                function isPointInWindow(point) {
                    return point.y > targetRect.top && point.y < targetRect.bottom && point.x < targetRect.right && point.x > targetRect.left;
                }

                function linkEndsOppositeSidesOfBorder(end1, end2, linkLine) {
                    var srcToEdge = side(end1, end2, linkLine.src);
                    var tarToEdge = side(end1, end2, linkLine.target);
                    return (srcToEdge ^ tarToEdge) < 0 || srcToEdge === 0 || tarToEdge === 0;
                }

                var tL = { x: targetRect.left, y: targetRect.top };
                var tR = { x: targetRect.right, y: targetRect.top };
                var bL = { x: targetRect.left, y: targetRect.bottom };
                var bR = { x: targetRect.right, y: targetRect.bottom };

                var svgRootCoor = {
                    x: this.svg.mainTreeContainer.rootXCoordinate,
                    y: this.svg.mainTreeContainer.rootYCoordinate
                };

                var linksToShow = [];
                _.each(allLinks, function (link) {
                    /*jshint maxcomplexity:16 */

                    //translate the D3 coordinates to the same coordinate system as the targetRect
                    //link's src and target x,y are switched because tree is sideways instead of vertical
                    //link is multipled by the scaleFactor since the link's coordinates aren't changed after creation
                    var targetLinkCoor = {
                        src: {
                            x: originalTargetCoor.left + svgRootCoor.x + (link.source.y + nodeWidth) * scaleFactor,
                            y: originalTargetCoor.top + svgRootCoor.y + link.source.x * scaleFactor
                        }, target: {
                            x: originalTargetCoor.left + svgRootCoor.x + link.target.y * scaleFactor,
                            y: originalTargetCoor.top + svgRootCoor.y + link.target.x * scaleFactor
                        }
                    };

                    var tLToLink = side(targetLinkCoor.src, targetLinkCoor.target, tL);
                    var tRToLink = side(targetLinkCoor.src, targetLinkCoor.target, tR);
                    var bLToLink = side(targetLinkCoor.src, targetLinkCoor.target, bL);
                    var bRToLink = side(targetLinkCoor.src, targetLinkCoor.target, bR);

                    //Since the endpoints have to be on opposite sides of the link, one must return positive and one return negative or one return 0.
                    //If the link is inside the targetRect, at least some of the endpoints will be on opposite sides of it.
                    //XOR drops any decimals but we only care about the sign
                    //XOR also returns the original sign if a value is 0 have to check for that case separately.
                    if ((tLToLink ^ tRToLink) > 0 && (tLToLink ^ bLToLink) > 0 && (tRToLink ^ bRToLink) > 0 && (bLToLink ^ bRToLink) > 0 && tLToLink !== 0 && tRToLink !== 0 && bLToLink !== 0 && bRToLink !== 0) {
                        //Border line endpoints are NOT on the opposite side of the link
                        //which implies that the link is outside of the targetRect.
                        return;
                    }

                    //Check if the link's endpoint(s) are in the window or
                    //if link endpoints are on opposite sides of a border and that border line is on opposite sides of the link.
                    if (isPointInWindow(targetLinkCoor.src)) {
                        //src is in window
                        linksToShow.push(link);
                    } else if (isPointInWindow(targetLinkCoor.target)) {
                        //target is in window
                        linksToShow.push(link);
                    } else if (linkEndsOppositeSidesOfBorder(tL, tR, targetLinkCoor) && ((tLToLink ^ tRToLink) < 0 || tLToLink === 0 || tRToLink === 0)) {
                        //crosses top border
                        linksToShow.push(link);
                    } else if (linkEndsOppositeSidesOfBorder(bL, bR, targetLinkCoor) && ((bLToLink ^ bRToLink) < 0 || bLToLink === 0 || bRToLink === 0)) {
                        //crosses bottom border
                        linksToShow.push(link);
                    } else if (linkEndsOppositeSidesOfBorder(tR, bR, targetLinkCoor) && ((tRToLink ^ bRToLink) < 0 || tRToLink === 0 || bRToLink === 0)) {
                        //crosses right border
                        linksToShow.push(link);
                    } else if (linkEndsOppositeSidesOfBorder(tL, bL, targetLinkCoor) && ((tLToLink ^ bLToLink) < 0 || tLToLink === 0 || bLToLink === 0)) {
                        //crosses left border
                        linksToShow.push(link);
                    }
                });

                return linksToShow;

                /*jshint bitwise: true*/
            },

            _translateNode: function (node) {
                var x = node.y;
                var y = this.options.respectNodeDimsOnDraw ? node.x - this.options.measurements.nodeHeight / 2 : node.x;
                return 'translate(' + x + ',' + y + ')';
            },

            _translateLinkToFinalPosition: function (link) {
                var y = this.options.respectNodeDimsOnDraw ? link.source.y + this.options.measurements.nodeWidth : link.source.y;
                var sourceCoordinates = {
                    x: link.source.x,
                    y: y
                };

                return getLinkFunc({
                    source: sourceCoordinates,
                    target: link.target
                });
            },

            render: function () {
                //reset the scale just like you'll be resetting the position
                this.scaleFactor = this.startingScale;

                //the renderTarget might not have been on the DOM at initialization so make sure to get it
                this.$el = $(this.renderTarget);

                this.$el.trigger('beforeRender');

                //_createSvgContainer doesn't need to be in render but is for the consumer's simplicity
                this._createSvgContainer();
                return $.when(this._renderTree()).done(_.bind(function () {
                    if (_.isFunction(this.postRender)) {
                        this.postRender();
                    }

                    this.$el.trigger('render');
                }, this));
            },

            _renderTree: function () {
                var deferred = $.Deferred(); //for minimap rendering

                //hide minimap while main tree is rendering so we don't display an old minimap with a new main tree while the new tree expands
                this.$el.find('.minimap-container').hide();

                var idIncrement = 0;
                var targetId = this.renderTarget.substr(1);
                function getId() {
                    return targetId + '-node' + idIncrement++;
                }

                // Normalize for fixed-depth since translating (0,0) messes with default calculations
                // Might as well add ids here as well since we're already looping through
                //this.root.descendants are the nodes and this loop modifies this.root.descendants
                _.each(this.root.descendants(), function (node) {
                    node.y = node.depth * this.options.measurements.childDistanceFromParent;
                    node.id = getId();
                }.bind(this));

                //links are the lines between the nodes
                // draw links first, avoids links rendering on top of nodes when drawing from center of node rather than edge,
                // like in the circle node case
                this._drawLinks();
                var nodeTransitionPromise = this._drawNodes();

                //let's wait for d3 to finish animations/transitions
                //before we render the minimap
                $.when(nodeTransitionPromise).done(_.bind(function () {
                    //The setTimeout is needed for IE so the minimap will render with the links in the proper location.
                    //It needs to be outside the if so the deferred promise isn't resolved early

                    setTimeout(_.bind(function () {
                        if (this.options.minimap.show) {
                            //initialize minimap here in case renderTarget wasn't on DOM earlier
                            //the function checks if it's already been called
                            this._initMinimap();
                            this.$el.find('.minimap-container').show(); //if you show after you add the minimap, the minimap tree position is wrong
                            this._addMinimap();
                        }

                        deferred.resolve();
                    }, this), 0);
                }, this));

                return deferred.promise();
            },

            _drawNodes: function () {
                //only add the event listeners once. Since the events are delegated, the listeners will still work even though .d3-node hasn't been added yet
                if (!this.$el.find('.d3-node').length) {
                    var _this = this;
                    if (this.options.highlightOnClick) {
                        this.$el.find('.main-tree-container').on('click', '.d3-node>:not(.' + this.options.skipSelectionClass + ')', function () {
                            _this._clickNodeHandler(_this._findNodeObjectFromHtml(this));
                        });
                    }

                    if (this.options.highlightOnHover) {
                        this.$el.find('.main-tree-container').on('mouseenter', '.d3-node', function () {
                            _this._hoverNodeHandler(_this._findNodeObjectFromHtml(this));
                        });

                        this.$el.find('.main-tree-container').on('mouseleave', '.d3-node', _.bind(this._removeHoverNodePath, this));
                    }
                }

                //clear all nodes, need this for when filters change and some nodes are still valid but now in a different place.
                //The remove() in _renderNodesInPosition is for dragging and zooming updates.
                this.svg.mainTreeContainer.selectAll('.' + this.options.nodeStyleClass).remove();

                var initialPosition = this._translateNode(this.root);

                var nodeCollection;
                if (this.options.virtualScrolling) {
                    nodeCollection = this._renderNodesInPosition(initialPosition, this._initialPaddedTargetRect());
                } else {
                    nodeCollection = this._renderNodesInPosition(initialPosition);
                }

                var nodeTransitionPromise = $.Deferred();

                //Transition nodes to their new position, use D3's call function to know when they're done.
                nodeCollection.transition().duration(this.options.animationDuration).attr('transform', _.bind(this._translateNode, this)).call(transitionEnd(nodeCollection.size()), function () {
                    nodeTransitionPromise.resolve();
                });

                return nodeTransitionPromise.promise();
            },

            _drawLinks: function () {
                //clear all links, need this for when filters change and some nodes are still valid but now in a different place.
                //The remove() in _renderLinksInPosition is for dragging and zooming updates.
                this.svg.mainTreeContainer.selectAll('.' + this.options.linkStyleClass).remove(); //use D3's remove

                var initialPosition = getLinkFunc({
                    source: this.root,
                    target: this.root
                });

                var linkCollection;
                if (this.options.virtualScrolling) {
                    linkCollection = this._renderLinksInPosition(initialPosition, this._initialPaddedTargetRect());
                } else {
                    linkCollection = this._renderLinksInPosition(initialPosition);
                }

                //Transition links to their new position
                linkCollection.transition().duration(this.options.animationDuration).attr('d', _.bind(this._translateLinkToFinalPosition, this));
            },

            _initialPaddedTargetRect: function () {
                var nodeHeight = this.options.measurements.nodeHeight;
                var nodeWidth = this.options.measurements.nodeWidth;
                var originalTargetCoor = this.$el[0].getBoundingClientRect(); //this returns a read-only value and corresponds to the coordinates the visible window is using

                /* Add a buffer zone of what extra to display when expanding from the root node.
                 * At the very least add 1/3 the original size times the ratio between the original size and node size.
                 * Divide by two to evenly add the size addition to both sides of the rectangle.
                 * With this math, the smaller the node size, the more nodes you'll render, but
                 * hopefully the smaller the node, the faster the DOM can render it so it will balance out.
                 * Don't worry about when the node is bigger than the original rectangle, zoom gets reset on render (which is when this gets called)
                 * and the tree isn't very useful that big anyways so that's unlikely to happen.
                */
                var heightRatio = originalTargetCoor.height / (nodeHeight + this.options.measurements.nodeSiblingPadding);
                var heightAddition = originalTargetCoor.height / 3 * heightRatio / 2;
                var widthRatio = originalTargetCoor.width / (nodeWidth + this.options.measurements.childDistanceFromParent);
                var widthAdditon = originalTargetCoor.width / 3 * widthRatio / 2;

                return {
                    top: originalTargetCoor.top - heightAddition,
                    bottom: originalTargetCoor.bottom + heightAddition,
                    left: originalTargetCoor.left - widthAdditon,
                    right: originalTargetCoor.right + widthAdditon
                };
            },

            _inViewTargetRect: function () {
                var nodeHeight = this.options.measurements.nodeHeight;
                var nodeWidth = this.options.measurements.nodeWidth;
                var originalTargetCoor = this.$el[0].getBoundingClientRect(); //this returns a read-only value and corresponds to the coordinates the visible window is using

                //Add a buffer of nodeHeight/Width around the originalTargetCoor for the case where it's zoomed in alot and a node corner isn't in the view but the node is still on screen
                return {
                    top: originalTargetCoor.top - nodeHeight * this.scaleFactor,
                    bottom: originalTargetCoor.bottom + nodeHeight * this.scaleFactor,
                    left: originalTargetCoor.left - nodeWidth * this.scaleFactor,
                    right: originalTargetCoor.right + nodeWidth * this.scaleFactor
                };
            },

            _findNodeObjectFromHtml: function (htmlElement) {
                var uniqueNodeId = $(htmlElement).closest('.d3-node').attr('unique-node-value');
                return this._findNodeObject(uniqueNodeId, this.root);
            },

            _clickNodeHandler: function (nodeClicked) {
                var styles = getStyleClasses(true);
                this._clearClickedStyling(styles, true);

                this.nodeClicked = nodeClicked;
                this._highlightNodePath(nodeClicked, styles, true);

                // trigger a nodeClicked event so that consumers can respond accordingly if needed
                this.$el.trigger('nodeClicked', nodeClicked);
            },

            _highlightNodePath: function (nodeHighlight, styles, isClicked) {
                //now add new styles
                if (this.options.emphasizeSelectedNode) {
                    this._findNodeElement(nodeHighlight)[0].classList.add(styles.emphasizedNodeClass);
                    if (isClicked && this.options.virtualScrolling) {
                        nodeHighlight.clickClass = styles.emphasizedNodeClass;
                    }
                } else {
                    this._findNodeElement(nodeHighlight)[0].classList.add(styles.nodeClass);
                    if (isClicked && this.options.virtualScrolling) {
                        nodeHighlight.clickClass = styles.nodeClass;
                    }
                }

                if (this.options.highlightChildren && nodeHighlight.children) {
                    this._highlightChildrenNodes(nodeHighlight, styles, isClicked);
                }

                if (nodeHighlight.parent) {
                    //allows easier unit testing
                    this._highlightAncestorNodes(nodeHighlight, styles, isClicked); //need the parent and the node for link highlighting
                }
            },

            _clearClickedStyling: function (styles, isClicked) {
                //Since highlighted nodes and links are lists of svg elements, jquery's removeClass doesn't work.
                //classList is a DOMTokenList which is why `remove` is used
                if (this.options.emphasizeSelectedNode) {
                    var emphasizedNode = $(this.renderTarget + ' .' + styles.emphasizedNodeClass);
                    if (emphasizedNode.length > 0) {
                        emphasizedNode[0].classList.remove(styles.emphasizedNodeClass);
                    }
                }

                var highlightedNodes = $(this.renderTarget + ' .' + styles.nodeClass);
                for (var i = 0; i < highlightedNodes.length; ++i) {
                    highlightedNodes[i].classList.remove(styles.nodeClass);
                }

                var highlightedLinks = $(this.renderTarget + ' .' + styles.linkClass);
                for (var j = 0; j < highlightedLinks.length; ++j) {
                    highlightedLinks[j].classList.remove(styles.linkClass);
                }

                if (isClicked && this.options.virtualScrolling && this.nodeClicked) {
                    //only needed when virtual scrolling
                    this.nodeClicked.clickClass = '';
                    var children = this.nodeClicked.descendants();

                    //linkClickClass is added to the target node, not the link object.
                    //This is because the link object is recalculated every time .links() is called and because this makes handling the ancestor links simplier.
                    _.each(children, function (child) {
                        child.clickClass = '';
                        child.linkClickClass = '';
                    });

                    var ancestors = this.nodeClicked.ancestors();
                    _.each(ancestors, function (ancestor) {
                        ancestor.clickClass = '';
                        ancestor.linkClickClass = '';
                    });
                }
            },

            _findNodeElement: function (node) {
                return $('#' + node.id);
            },

            _findLinkToNode: function (node) {
                return $('#link-to-' + node.id);
            },

            _highlightChildrenNodes: function (node, styles, isClicked) {
                var descendantNodes = node.descendants();
                for (var i = 1; i < descendantNodes.length; ++i) {
                    //the 0th element is the current node, not the first child
                    //But the link list is one less than the node list
                    if (isClicked && this.options.virtualScrolling) {
                        //add the clickClass in case the node/link isn't on the DOM but will be dragged on later while it should still be highlighted
                        //Adding the linkClickClass directly on the target node means it will always be there later.
                        //The links() function recalculates the links everytime and can't be modified directly
                        descendantNodes[i].clickClass = styles.nodeClass;
                        descendantNodes[i].linkClickClass = styles.linkClass;
                    }

                    //classList is a DOMTokenList so you can use add
                    var childDomElement = this._findNodeElement(descendantNodes[i])[0];
                    if (childDomElement) {
                        childDomElement.classList.add(styles.nodeClass);
                    }

                    var childLink = this._findLinkToNode(descendantNodes[i])[0];
                    if (childLink) {
                        childLink.classList.add(styles.linkClass);
                    }
                }
            },

            _highlightAncestorNodes: function (node, styles, isClicked) {
                var parentNodes = node.ancestors();
                for (var i = 1; i < parentNodes.length; ++i) {
                    //the 0th element is the current node, not the first parent
                    if (isClicked && this.options.virtualScrolling) {
                        //add the clickClass in case the node/link isn't on the DOM but will be dragged on later while it should still be highlighted
                        //Adding the linkClickClass directly on the target node means it will always be there later.
                        //The links() function recalculates the links everytime and can't be modified directly
                        //link's -1 is explained further down
                        parentNodes[i].clickClass = styles.nodeClass;
                        parentNodes[i - 1].linkClickClass = styles.linkClass;
                    }

                    var parentDomElement = this._findNodeElement(parentNodes[i])[0];

                    if (parentDomElement) {
                        //classList is a DOMTokenList so you can use add
                        parentDomElement.classList.add(styles.nodeClass);
                    }

                    //Highlight the link in the path coming from the parent to the previous node in the parent array. That previous node just so happens to be its child.
                    //This prevents trying to highlight a link to the root node which doesn't exist and it prevents needing special handling for the selected node.
                    //The array order of the parent nodes is guaranteed in D3's API.
                    var parentLink = this._findLinkToNode(parentNodes[i - 1])[0];
                    if (parentLink) {
                        parentLink.classList.add(styles.linkClass);
                    }
                }
            },

            _hoverNodeHandler: function (nodeHovered) {
                var styles = getStyleClasses(false);
                this._highlightNodePath(nodeHovered, styles);
            },

            _removeHoverNodePath: function () {
                var styles = getStyleClasses(false);
                this._clearClickedStyling(styles, false);
            },

            clickOn: function (uniqueNodeValue) {
                var nodeToClick = this._findNodeObject(uniqueNodeValue, this.root);
                if (nodeToClick) {
                    this._clickNodeHandler(nodeToClick);
                }

                return nodeToClick;
            },

            _getDesiredCenteringAmount: function (nodeToCenter) {
                var targetRect = this.$el[0].getBoundingClientRect();

                //Since the origin of the tree has been translated, have to translate the
                //nodeToCenter's coordinates so the targetRect correctly knows how much to move it by
                //nodeToCenter's x,y are switched because tree is sideways instead of vertical
                //nodeToCenter is multipled by the scaleFactor since the nodeObject's coordinates aren't changed after creation
                var dx = nodeToCenter.y * this.scaleFactor;
                var dy = nodeToCenter.x * this.scaleFactor;

                //translate the D3 coordinates to the same coordinate system as the targetRect
                var targetNodeCoor = {
                    x: targetRect.left + this.svg.mainTreeContainer.rootXCoordinate + dx,
                    y: targetRect.top + this.svg.mainTreeContainer.rootYCoordinate + dy
                };

                var targetCenter = {
                    x: targetRect.left + targetRect.width / 2,
                    y: targetRect.top + targetRect.height / 2
                };

                var desiredMoveAmount = {
                    x: targetCenter.x - targetNodeCoor.x,
                    y: targetCenter.y - targetNodeCoor.y
                };

                return desiredMoveAmount;
            },

            //Note: This function assumes it's been given a uniqueNodeValue that EXISTS in the tree
            centerOn: function (uniqueNodeValue) {
                // wait to highlight it until it's rendered
                var nodeToCenter = this._findNodeObject(uniqueNodeValue, this.root);
                if (!nodeToCenter) {
                    return;
                } //for first handler on ticker change

                var desiredMoveAmount = this._getDesiredCenteringAmount(nodeToCenter);

                //If you have a minimap, there are boundaries of how far you are allowed to go when centering
                //else, you don't care about boundaries and just move to the center.
                //(If you have virtual scrolling and no minimap, you actually can't tell how big the main tree is to know about any boundaries even if you wanted to.)
                if (this.options.minimap.show) {
                    //translate move amounts into scale of the minimap
                    var miniX = -desiredMoveAmount.x * this.minimapDiv.minimapContainer.miniTree.wScalingFactor / this.scaleFactor;
                    var miniY = -desiredMoveAmount.y * this.minimapDiv.minimapContainer.miniTree.hScalingFactor / this.scaleFactor;

                    var miniMoveAmount = this._getMaxMinimapMoveAmount(miniX, miniY);

                    this._handleMinimapZoomDrag(miniMoveAmount);
                } else {
                    var newCoordinates = {
                        x: this.svg.mainTreeContainer.rootXCoordinate + desiredMoveAmount.x,
                        y: this.svg.mainTreeContainer.rootYCoordinate + desiredMoveAmount.y
                    };

                    //need the scale factor when the zooming has changed
                    this._moveScaleMainTree(newCoordinates.x, newCoordinates.y);
                    this.svg.mainTreeContainer.rootXCoordinate = newCoordinates.x;
                    this.svg.mainTreeContainer.rootYCoordinate = newCoordinates.y;
                    if (this.options.virtualScrolling) {
                        this._updateVisibleTree();
                    }
                }

                //highlight the newly centered node as if it was clicked on
                this._clickNodeHandler(nodeToCenter);
            },

            // This finds the tree object rather than the dom element
            _findNodeObject: function (uniqueNodeValue, nodeToInspect) {
                if (nodeToInspect.data[this.options.uniqueNodeAttribute] === uniqueNodeValue) {
                    return nodeToInspect;
                }

                //This is depth search but depth isn't usually too many levels, China was 12 deep as of 12/12/2016.
                if (nodeToInspect.children) {
                    for (var i = 0; i < nodeToInspect.children.length; ++i) {
                        var res = this._findNodeObject(uniqueNodeValue, nodeToInspect.children[i]);
                        if (res) {
                            return res;
                        }
                    }
                }

                return false;
            },

            _initMinimap: function () {
                if ($(this.renderTarget + ' .minimap-container').length) {
                    return; //this function has already been called
                }

                this.minimapDiv = d3.select(this.renderTarget).append('xhtml:div');

                //set up based on which corner the minimap is in
                var loc = this.options.minimap.location;
                var template; //The minimize/maximize arrow has to start in the proper direction
                var style = '';
                var classed = 'minimap-container';
                if (loc === 'tr' || loc === 'tl') {
                    template = _.template(minimapContainerTopTemplate());
                    style = loc === 'tr' ? 'top:0px; right:0px;' : 'top:0px; left:0px;';
                    classed += ' minimap-container-top';
                } else if (loc === 'br' || loc === 'bl') {
                    template = _.template(minimapContainerBottomTemplate());
                    style = loc === 'br' ? 'bottom:0px; right:0px;' : 'bottom:0px; left:0px;';
                    classed += ' minimap-container-bottom';
                }

                this.minimapDiv.attr('style', style);
                this.minimapDiv.classed(classed, true);
                this.minimapDiv.html(template());

                this.$minimapDiv = $(this.renderTarget + ' > .minimap-container');

                this.$minimapDiv.find('.action-zoom-in').on('click', _.bind(this._minimapZoomIn, this));
                this.$minimapDiv.find('.action-zoom-out').on('click', _.bind(this._minimapZoomOut, this));
                this.$minimapDiv.find('.action-zoom-default').on('click', _.bind(this._minimapZoomDefault, this));
                this.$minimapDiv.find('.action-toggle').on('click', _.bind(this._minimapToggle, this));
            },

            _addMinimap: function () {
                if (this.minimapDiv.minimapContainer) {
                    this._turnOffMinimapDragListeners();
                }

                this.$minimapDiv.find('.mini-svg').remove();

                //define height and width for minimap container
                var minimapHeight = this.options.minimap.height;
                var minimapWidth = this.options.minimap.width;
                var miniSvgHeight = minimapHeight * 1.1;
                var miniSvgWidth = minimapWidth * 1.1;

                var miniSvg = this.minimapDiv.select('.mini-svg-placeholder').insert('svg', ':first-child').classed('mini-svg', true).attr('width', miniSvgWidth).attr('height', miniSvgHeight);
                var $miniSvg = this.$minimapDiv.find('.mini-svg');

                this.minimapDiv.minimapContainer = miniSvg.append('g').classed('minimap', true).attr('width', minimapWidth).attr('height', minimapHeight);

                //finding based on the class attribute b/c of this issue in IE: https://github.com/jquery/sizzle/issues/322
                this.minimapDiv.$minimapContainer = $miniSvg.find('[class~=minimap]');

                this._addMiniTree();

                this._scaleAndCenterMiniTree($miniSvg);

                this._renderMinimapContainer();
            },

            _turnOffMinimapDragListeners: function () {
                if (this.minimapDiv.minimapContainer.minimapHighlighted) {
                    this.minimapDiv.minimapContainer.minimapHighlighted.on('.drag', null); //how D3 says to remove drag listeners
                }
            },

            _addMiniTree: function () {
                this.minimapDiv.minimapContainer.miniTree = this.minimapDiv.minimapContainer.append('g');

                var minimapLinkCollection = this.minimapDiv.minimapContainer.miniTree.selectAll('.' + this.options.minimap.linkStyleClass).data(this.root.links()).enter().append('path').attr('class', 'd3-minimap-link ' + this.options.minimap.linkStyleClass).attr('d', _.bind(this._translateLinkToFinalPosition, this));

                if (_.isFunction(this.options.minimap.addLinkPropertiesFunction)) {
                    this.options.minimap.addLinkPropertiesFunction(minimapLinkCollection);
                }

                var minimapNodeCollection = this.minimapDiv.minimapContainer.miniTree.selectAll('.' + this.options.minimap.nodeStyleClass).data(this.root.descendants()).enter().append('g').attr('class', 'd3-minimap-node ' + this.options.minimap.nodeStyleClass).attr('transform', _.bind(this._translateNode, this));

                if (_.isFunction(this.options.minimap.addNodeContentFunction)) {
                    this.options.minimap.addNodeContentFunction(minimapNodeCollection);
                }
            },

            _scaleAndCenterMiniTree: function ($miniSvg) {
                var originalSize = this.minimapDiv.$minimapContainer[0].getBoundingClientRect();
                this._findMinimapScaleFactors({
                    height: originalSize.height,
                    width: originalSize.width
                }, {
                    height: this.options.minimap.height,
                    width: this.options.minimap.width
                });

                //need to scale the miniTree before it gets translated so the math to translate it can be based off the finished size
                this.minimapDiv.minimapContainer.miniTree.attr('transform', 'scale(' + this.minimapDiv.minimapContainer.miniTree.wScalingFactor + ',' + this.minimapDiv.minimapContainer.miniTree.hScalingFactor + ')');

                //move the minimap tree to the correct position on the minimap
                //these selectors allow for the possibility of more than one tree on the DOM
                //need to use DOM coordinates, not measurements, especially when the minimap is positioned on the bottom
                var miniTreeRect = this.minimapDiv.$minimapContainer[0].getBoundingClientRect();
                var miniSvgRect = this._getMiniSvgRect($miniSvg[0]);
                var yAxisDistanceToMove = miniSvgRect.bottom - (miniSvgRect.height - miniTreeRect.height) / 2 - miniTreeRect.bottom;

                //move the mini tree into the center of the minimap
                this._moveSelector(this.minimapDiv.minimapContainer, this.options.treeContainerPadding * this.minimapDiv.minimapContainer.miniTree.wScalingFactor / 2, yAxisDistanceToMove);
            },

            _findMinimapScaleFactors: function (mainTreeSize, miniTreeSize) {
                if (mainTreeSize.height > miniTreeSize.height) {
                    //Since the minimap space doesn't change even when zooming, don't care about this.scaleFactor
                    this.minimapDiv.minimapContainer.miniTree.hScalingFactor = this.options.minimap.height / mainTreeSize.height;
                } else {
                    this.minimapDiv.minimapContainer.miniTree.hScalingFactor = 1;
                }

                if (mainTreeSize.width > miniTreeSize.width) {
                    this.minimapDiv.minimapContainer.miniTree.wScalingFactor = this.options.minimap.width / mainTreeSize.width;
                } else {
                    this.minimapDiv.minimapContainer.miniTree.wScalingFactor = 1;
                }
            },

            _renderMinimapContainer: function () {
                this._turnOffMinimapDragListeners();
                this.minimapDiv.minimapContainer.select('rect.frame').remove(); //uses D3 remove

                //how big the highlighting rectangle should be
                var minimapHighlightedSize = this._getMinimapHighlightedSize();

                //used to locate where you are on the main tree
                var mainTreeContainerX = this.svg.mainTreeContainer.rootXCoordinate || 0;
                var mainTreeContainerY = this.svg.mainTreeContainer.rootYCoordinate || 0;

                //negative signs are needed or the highlighted section doesn't position properly.
                //I think it's probably something to do with how the coordinate system works.
                var frameX = -mainTreeContainerX * this.minimapDiv.minimapContainer.miniTree.wScalingFactor / this.scaleFactor;
                var frameY = -mainTreeContainerY * this.minimapDiv.minimapContainer.miniTree.hScalingFactor / this.scaleFactor;

                //this is minimap's rectangle indicating which part of the tree you're looking at
                this.minimapDiv.minimapContainer.minimapHighlighted = this.minimapDiv.minimapContainer.append('rect').classed('frame', true).classed('tf-draggable', true).attr('width', minimapHighlightedSize.width).attr('height', minimapHighlightedSize.height);

                //finding based on the class attribute b/c of this issue in IE: https://github.com/jquery/sizzle/issues/322
                this.minimapDiv.minimapContainer.$minimapHighlighted = this.minimapDiv.$minimapContainer.find('[class~=frame]');
                this._moveSelector(this.minimapDiv.minimapContainer.minimapHighlighted, frameX, frameY);

                //the main tree will need to know where the minimap (0,0) (aka the root node) is
                this.minimapDiv.minimapContainer.rootXCoordinate = frameX;
                this.minimapDiv.minimapContainer.rootYCoordinate = frameY;

                //refresh or create drag event handler for minimap
                var drag = this._minimapDrag();
                this.minimapDiv.minimapContainer.minimapHighlighted.call(drag);
            },

            _getMinimapHighlightedSize: function () {
                var viewPortW = this.$el.innerWidth();
                var viewPortH = this.$el.innerHeight();

                //When the main tree has been zoomed, need the scaleFactor to know how much the highlighted part is affected
                var width = viewPortW * this.minimapDiv.minimapContainer.miniTree.wScalingFactor / this.scaleFactor;

                //Note, when whole the tree fits in the view vertically, height is bigger than it needs to be. height is correct when the tree is bigger than the view.
                var height = viewPortH * this.minimapDiv.minimapContainer.miniTree.hScalingFactor / this.scaleFactor;
                return {
                    width: width,
                    height: height
                };
            },

            //if in cef1, getBoundingClientRect doesn't return correctly
            _getMiniSvgRect: function (div) {
                return !thief.support.ASYNC_BROWSER_API ? div.getClientRects()[0] : div.getBoundingClientRect();
            },

            //All the boundaries on movement come from the minimap so take in the miniTree
            //desired move amounts and figure out how far is it actually allowed to move with the minimap
            _getMaxMinimapMoveAmount: function (desiredX, desiredY) {
                var miniSvgRect = this._getMiniSvgRect(this.$minimapDiv.find('.mini-svg')[0]);
                var miniHighlightedRect = this.minimapDiv.minimapContainer.$minimapHighlighted[0].getBoundingClientRect();

                var actualMiniMoveAmount = { x: 0, y: 0 };
                if (desiredX > 0 && miniHighlightedRect.right < miniSvgRect.right) {
                    //moving the miniRect right
                    actualMiniMoveAmount.x = Math.min(desiredX, miniSvgRect.right - miniHighlightedRect.right);
                } else if (desiredX < 0 && miniHighlightedRect.left > miniSvgRect.left) {
                    //moving the miniRect left
                    actualMiniMoveAmount.x = Math.max(desiredX, miniSvgRect.left - miniHighlightedRect.left);
                }

                if (desiredY > 0 && miniHighlightedRect.bottom < miniSvgRect.bottom) {
                    //moving the miniRect down
                    actualMiniMoveAmount.y = Math.min(desiredY, miniSvgRect.bottom - miniHighlightedRect.bottom);
                } else if (desiredY < 0 && miniHighlightedRect.top > miniSvgRect.top) {
                    //moving the miniRect up
                    actualMiniMoveAmount.y = Math.max(desiredY, miniSvgRect.top - miniHighlightedRect.top);
                }

                return actualMiniMoveAmount;
            },

            _minimapDrag: function () {
                return d3.drag().on('start.frame', _.bind(function () {
                    this.minimapDiv.minimapContainer.$minimapHighlighted[0].classList.add('tf-dragging-inprogress');
                    this.$el.trigger('treeDragStart');
                }, this)).on('end.frame', _.bind(function () {
                    this.minimapDiv.minimapContainer.$minimapHighlighted[0].classList.remove('tf-dragging-inprogress');
                    this.$el.trigger('treeDragEnd');
                }, this)).on('drag.frame', _.bind(function () {
                    d3.event.sourceEvent.stopImmediatePropagation();
                    var maxMove = this._getMaxMinimapMoveAmount(d3.event.dx, d3.event.dy);
                    this._handleMinimapZoomDrag(maxMove);
                }, this));
            },

            //This moves the minimap tree and the main tree.
            _handleMinimapZoomDrag: function (moveAmount) {
                var miniTranslateX = this.minimapDiv.minimapContainer.rootXCoordinate + moveAmount.x;
                var miniTranslateY = this.minimapDiv.minimapContainer.rootYCoordinate + moveAmount.y;

                this._moveSelector(this.minimapDiv.minimapContainer.minimapHighlighted, miniTranslateX, miniTranslateY);

                //now move the main tree
                //negative signs are needed since the minimap's highlighted part needs to move in the opposite direction of the drag
                //like dragging down the highlighted part makes the main tree move up
                //Need this.scaleFactor when zooming so the main tree only moves enough to account for things needing to be recentered
                var translateMainX = -miniTranslateX / this.minimapDiv.minimapContainer.miniTree.wScalingFactor * this.scaleFactor;
                var translateMainY = -miniTranslateY / this.minimapDiv.minimapContainer.miniTree.hScalingFactor * this.scaleFactor;

                //scale is needed when zooming has been used
                this._moveScaleMainTree(translateMainX, translateMainY);

                this.minimapDiv.minimapContainer.rootXCoordinate = miniTranslateX;
                this.minimapDiv.minimapContainer.rootYCoordinate = miniTranslateY;
                this.svg.mainTreeContainer.rootXCoordinate = translateMainX;
                this.svg.mainTreeContainer.rootYCoordinate = translateMainY;

                if (this.options.virtualScrolling) {
                    this._updateVisibleTree();
                }
            },

            _minimapZoomIn: function () {
                //scaleTo is a D3 function
                this.zoom.scaleTo(this.svg, this.scaleFactor + this.options.minimap.scaleStep);
            },

            _minimapZoomOut: function () {
                //scaleTo is a D3 function
                this.zoom.scaleTo(this.svg, this.scaleFactor - this.options.minimap.scaleStep);
            },

            _minimapZoomDefault: function () {
                //scaleTo is a D3 function
                this.zoom.scaleTo(this.svg, this.startingScale);
            },

            _minimapToggle: function () {
                //collapsed class used since button direction changes depending on minimap.location
                if (this.$minimapDiv.hasClass('collapsed')) {
                    this.$minimapDiv.removeClass('collapsed');
                    this.$minimapDiv.css('transform', '');
                } else {
                    this.$minimapDiv.addClass('collapsed');

                    //miniSvg height is minimap.height * 1.1, add 10 for padding and 1 for border
                    var translationAmount = this.options.minimap.height * 1.1 + 11;

                    if (this.options.minimap.location === 'tr' || this.options.minimap.location === 'tl') {
                        //the negative is because need to move it up
                        this.$minimapDiv.css('transform', 'translateY(-' + translationAmount + 'px)');
                    } else {
                        //the positive is because need to move it down
                        this.$minimapDiv.css('transform', 'translateY(' + translationAmount + 'px)');
                    }
                }

                var toggleBtnIcon = this.$minimapDiv.find('.action-toggle').children('i');
                toggleBtnIcon.toggleClass('icon-chevron-down1-s icon-chevron-up1-s');
            },

            addResizeHandler: function () {
                //save the event/listener so it can be removed without affecting other listeners on the resize event
                this.resizeHandler = _.bind(_.throttle(function () {
                    this._sizeSvgContainer();

                    if (this.options.virtualScrolling) {
                        this._updateVisibleTree();
                    }

                    if (this.options.minimap.show) {
                        this._renderMinimapContainer();
                    }
                }, 100), this);

                $(window).on('resize', this.resizeHandler);
            },

            removeResizeHandler: function () {
                $(window).off('resize', this.resizeHandler);
            },

            destroy: function () {
                this.removeResizeHandler();
                this.$el.empty(); //this should remove the local event listeners too

                if (this.options.fullScreen) {
                    //make it so it doesn't take up anymore space on the DOM
                    this.$el.height(0);
                    this.$el.width(0);
                }

                this._setTreeData({});
            }
        };
        globals.D3Treeview = Treeview;
    })(window, _, $, d3, thief);
})();
//# sourceMappingURL=d3-treeview.js.map