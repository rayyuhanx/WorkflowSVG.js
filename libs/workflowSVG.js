/*!
 * workflowSVG.js - Workflow SVG javascrip tool using the svg.js
 * @version 0.0.1
 * https://svgdotjs.github.io/
 * https://rayyuhanx.github.io/
 *
 * @copyright RayYuhan <rayyuhanx@hotmail.com>
 * @license MIT
 *
 * BUILT: Mon Feb 05 2018 16:51:02 GMT+0800 (China Standard Time)
 */
;
(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		define(function () {
			return factory(root, root.document)
		})
	} else if (typeof exports === 'object') {
		module.exports = root.document ? factory(root, root.document) : function (w) {
			return factory(w, w.document)
		}
	} else {
		root.WorkflowSVG = factory(root, root.document)
	}
}(typeof window !== "undefined" ? window : this, function (window, document) {
	// Check the svg.js
	if (typeof SVG === 'undefined') {
		throw Error('SVG.js is not be loaded')
	}
	// Disable svg.js default append svg element
	SVG.parser.draw = !0

	/*/
	/* =======================================================================================================
	/* Private function																	 				 	 =
	/* =======================================================================================================
	/*/
	var svg = {}
	// default option
	var DEFUALT = {
		contianer: document.body,
		element: 'workflow-svg',
		server: ''
	}
	var nodeArray = []
	var lineArray = []

	// utility
	function util_extend() {
		/*/
		/* Copy from jquery-2.2.4 line:175
		/*/
		var options, name, src, copy, copyIsArray, clone,
			target = arguments[0] || {},
			i = 1,
			length = arguments.length,
			deep = false;

		// Handle a deep copy situation
		if (typeof target === "boolean") {
			deep = target;

			// Skip the boolean and the target
			target = arguments[i] || {};
			i++;
		}

		// Handle case when target is a string or something (possible in deep copy)
		if (typeof target !== "object" && typeof target !== 'function') {
			target = {};
		}

		// Extend jQuery itself if only one argument is passed
		if (i === length) {
			target = this;
			i--;
		}

		for (; i < length; i++) {

			// Only deal with non-null/undefined values
			if ((options = arguments[i]) != null) {

				// Extend the base object
				for (name in options) {
					src = target[name];
					copy = options[name];

					// Prevent never-ending loop
					if (target === copy) {
						continue;
					}

					// Recurse if we're merging plain objects or arrays
					if (deep && copy && (util_isPlainObject(copy) ||
							(copyIsArray = Array.isArray(copy)))) {

						if (copyIsArray) {
							copyIsArray = false;
							clone = src && Array.isArray(src) ? src : [];

						} else {
							clone = src && util_isPlainObject(src) ? src : {};
						}

						// Never move original objects, clone them
						target[name] = util_extend(deep, clone, copy);

						// Don't bring in undefined values
					} else if (copy !== undefined) {
						target[name] = copy;
					}
				}
			}
		}

		// Return the modified object
		return target;
	}

	function util_isPlainObject(obj) {
		/*/
		/* Copy from jquery-2.2.4 line:278
		/*/
		var key;

		// Not plain objects:
		// - Any object or value whose internal [[Class]] property is not "[object Object]"
		// - DOM nodes
		// - window
		if (typeof obj !== "object" || !obj instanceof Object) {
			return false;
		}

		// Not own constructor property must be Object
		if (obj.constructor &&
			!({}).hasOwnProperty.call(obj, "constructor") &&
			!({}).hasOwnProperty.call(obj.constructor.prototype || {}, "isPrototypeOf")) {
			return false;
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own
		for (key in obj) {}

		return key === undefined || ({}).hasOwnProperty.call(obj, key);
	}

	function util_isDOMElement(obj) {
		return obj && (obj === window || obj.nodeType)
	}

	function util_isArray(obj) {
		return Array.isArray(obj)
	}

	function util_throw(text) {
		throw Error(text)
	}

	function util_get(n) {
		return nodeArray.findByObject({
			k: n
		})
	}

	// method
	function method_opt(opt) {
		WorkflowSVG.options = util_extend({}, DEFUALT, opt, WorkflowSVG.options)
	}

	function method_createElement() {
		var container = WorkflowSVG.options.contianer
		if (!util_isDOMElement(container)) {
			util_throw('WorkflowSVG container is not an element')
		}

		var element = WorkflowSVG.options.element
		var div = document.createElement('div')
		div.id = element
		// fullpage
		container.appendChild(div)

		// inistailize svg.js
		svg = SVG(element)
	}

	function method_load(data) {
		var server = WorkflowSVG.options.server
		if (!server && !data) {
			util_throw('WorkflowSVG need request url or data to load')
		}
		// if (!Array.isArray(data)) {
		// 	_.throw('The data must be an array')
		// }
		// create svg default marker
		var DEFAULT_MARKER = svg.marker(10, 10, function (add) {
			add.path('M 0 0 L 10 5 L 0 10 z')
		})
		if (data) {
			var connections = []
			var links = svg.group()
			// circle
			for (var i = 0, nodes = data.nodes; i < nodes.length; i++) {

				var node = nodes[i]
				// circle
				var circle = svg.circle(70).fill('#f06').move(node.x, node.y).draggable()
				if (util_isArray(node.c)) {
					connections.push({
						k: node.n,
						v: node.c
					})
				}
				// save added nodes
				nodeArray.push({
					k: node.n,
					v: circle
				})
			}
			for (var i = 0; i < connections.length; i++) {
				var conn = connections[i]
				var node = util_get(conn.k)
				for (var j = 0; j < conn.v.length; j++) {
					var target = util_get(conn.v[j])
					node.v.connectable({
						container: links,
						marker: 'default',
						targetAttach: 'perifery',
						color: '#2a88c9'
					}, target.v);
				}
			}
		} else if (server) {
			// request
		}
	}

	// svg.js extension
	function extension_panzoom() {
		// https://github.com/svgdotjs/svg.panzoom.js
		svg.panZoom({
			zoomMin: 0.4,
			zoomMax: 3
		})
	}
	// array extend
	Array.prototype.findByObject = function (obj) {
		var v, i
		for (i in obj) {}
		for (var j in this) {
			if (this[j][i] === obj[i]) {
				v = this[j]
				break
			}
		}
		return v
	}

	/*/
	/* =======================================================================================================
	/* Public object and function																	 		 =
	/* =======================================================================================================
	/*/

	// Initialize svg
	var WorkflowSVG = this.WorkflowSVG = function (opt) {
		// Check support
		if (!SVG.supported) {
			util_throw('SVG not supported')
		}

		method_opt(opt)
		method_createElement()
		method_load({
			title: 'workflow svg',
			nodes: [{
				// name
				n: 'node1',
				// // type
				// t:''
				// position
				x: 10,
				y: 10,
				// connection
				c: ['node2']
			}, {
				n: 'node2',
				x: 100,
				y: 80,
				c: ['node3']
			}, {
				n: 'node3',
				x: 100,
				y: 10,
				c: ['node1']
			}]
		})
		extension_panzoom()
	}

	WorkflowSVG.options = method_opt()
	return WorkflowSVG
}));