
function DrawingTools(pixelUnit, getRandom) {
	const drawingTool = this;

	this.seed = (function (getRandom) {
		const getSeed = getRandom().seed;
		let count = 0;
		const i = [];

		return {
			reset() {
				let l = count;
				while (l--) {
					i[l] = 0;
				}
			},
			get(j) {
				const seed = j || getSeed();
				const nr = count += 1;

				return function () {
					return getRandom(seed + (i[nr]++) || 0);
				};
			},
		};
	}(getRandom));

	this.pixelSetter = (function () {
		let colorArray;
		const formSave = {};
		const getSet = function (color, zInd, id) {
			return function () {	return colorArray.getSet(color, zInd, id); };
		};
		const getClear = function (id) {
			return function () { return colorArray.getClear(id); };
		};
		const getSetForRect = function (color, zInd, id) {
			return function () { return colorArray.getSetForRect(color, zInd, id); };
		};
		const getClearForRect = function (id) {
			return function () { return colorArray.getClearForRect(id); };
		};
		const getSave = function (name, isRect) {
			return function () {
				const thisSave = formSave[name] ? formSave[name] : (formSave[name] = {});
				const save = thisSave.save ? thisSave.save : (thisSave.save = []);
				const mask = thisSave.mask ? thisSave.mask : (thisSave.mask = []);

				return isRect
					? colorArray.getSaveForRect(save, mask)
					:						function (x, y) {
						save.push([x, y]);

						if (!mask[x]) { mask[x] = []; }
						mask[x][y] = true;
					};
			};
		};
		const getClearSave = function (name, isRect) {
			return function () {
				const thisSave = formSave[name];
				let save; let
					mask;

				if (thisSave) {
					save = thisSave.save;
					mask = thisSave.mask;

					return isRect
						? colorArray.getClearSaveForRect(save, mask)
						:							function () {};
				}
			};
		};
		const getColorMask = function (dimensions, push) {
			return colorArray.setMask(dimensions, push);
		};

		return {
			setArray(newArray) {
				const forms = formSave; let
					key;

				for (key in forms) { forms[key] = []; }

				colorArray = newArray;
			},

			setColorArray(color, clear, zInd, id, isRect, save) {
				return clear
					? isRect
						? save
							? getClearSave(save, isRect)
							: getClearForRect(id)
						: save
							? getClearSave(save, isRect)
							: getClear(id)
					:					color
						? isRect
							? getSetForRect(color, zInd, id)
							: getSet(color, zInd, id)
						:						save
							? getSave(save, isRect)
							: undefined;
			},

			setColorMask: getColorMask,

			getSave(name) {
				return formSave[name] ? formSave[name].save : false;
			},

			getMask(name) {
				return formSave[name] ? formSave[name].mask : false;
			},
		};
	}());

	this.Primitive	= function Primitive() {};

	this.PointBased	= function PointBased() {};
	this.Dot		= function Dot() {};
	this.Line 		= function Line() {};
	this.Polygon	= function Polygon() {};

	this.Fill 		= function Fill() {};
	this.FillRandom	= function FillRandom() {};

	this.ShapeBased	= function ShapeBased() {};
	this.Rect 		= function Rect() {};
	this.Stripes	= function Stripes() {};

	this.Obj 		= function Obj() {};
	this.RoundRect 	= function RoundRect() {};
	this.Grid 		= function Grid() {};
	this.Panels 	= function Panels() {};
	this.Arm 		= function Arm() {};

	// ------------------ PRIMITIVES ------------------
	this.Primitive.prototype.getName = 'Primitive';

	this.Primitive.prototype.create = (function () {
		const { setColorArray } = drawingTool.pixelSetter;
		const { setColorMask } = drawingTool.pixelSetter;

		return function (args, inherit) {
			inherit = inherit || {};

			let newArgs;
			let reflectX = (inherit.reflectX || false);
			let reflectY = (inherit.reflectY || false);
			let rotate = (inherit.rotate || 0);

			if (rotate >= 360) { rotate -= 360; } else if (rotate < 0) { rotate += 360; }

			// if( rotate === 90 || rotate === 270 ) {
			// 	rotate += ( ( reflectX ? 180 : 0 ) + ( reflectY ? 180 : 0 ) );

			// 	if( rotate >= 360 ) { rotate -=360; }
			// }

			if (rotate === 180) { rotate = 0; reflectX = !reflectX; reflectY = !reflectY; }
			if (rotate === 270) { rotate = 90; reflectX = !reflectX; reflectY = !reflectY; }

			newArgs = this.prepareSizeAndPos(
				args,
				reflectX,
				reflectY,
				this.rotate = rotate === 90,
			) || {};

			newArgs.reflectX = (args.rX || false) !== reflectX;
			newArgs.reflectY = (args.rY || false) !== reflectY;
			newArgs.rotate = rotate + (args.rotate || 0);

			if (args.save || inherit.save)				{ newArgs.save = args.save || inherit.save; } else if (args.color || inherit.color)		{ newArgs.color = args.color || inherit.color; }

			if (args.clear || inherit.clear)			{ newArgs.clear = true; }
			if (args.id || inherit.id || newArgs.save)	{ newArgs.id = args.id || inherit.id || newArgs.save; }
			if (args.mask)								{ newArgs.mask = setColorMask; }

			newArgs.zInd = (inherit.zInd || 0) + (args.z || 0);

			if (args.list) {
				newArgs.list = args.list;
			} else {
				this.getColorArray = setColorArray(
					newArgs.color,
					newArgs.clear,
					newArgs.zInd,
					newArgs.id,
					this.isRect,
					newArgs.save,
				);
			}

			this.args = newArgs;
			if (this.init) { this.init(args); }
			if (this.detailInit) { this.detailInit(args, inherit); }

			return this;
		};
	}());

	this.Primitive.prototype.prepareSizeAndPos = (function (Dimensions) { // Prepare Size and Position Data for Basic Objects
		return function (args, reflectX, reflectY, rotate) {
			this.dimensions = new Dimensions(
				args,
				this.fromRight = (rotate ? ((args.fY || false) === reflectY) : ((args.fX || false) !== reflectX)),
				this.fromBottom = (rotate ? ((args.fX || false) !== reflectX) : ((args.fY || false) !== reflectY)),
				rotate,
			);
		};
	}(pixelUnit.Dimensions));

	// ------------------ PointBased ------------------
	this.PointBased.prototype = new this.Primitive();
	this.PointBased.prototype.getName = 'PointBased';

	// ------------------ Dot ------------------
	this.Dot.prototype = new this.PointBased();
	this.Dot.prototype.getName = 'Dot';
	this.Dot.prototype.draw = function () {
		const pos = this.args.getRealPosition();
		this.getColorArray()(pos.x, pos.y);
	};

	this.Dot.prototype.prepareSizeAndPos = function (args, reflectX, reflectY, rotate) {
		return { getRealPosition: new pixelUnit.Position(args, reflectX, reflectY, rotate) };
	};

	// ------------------ Line ------------------
	this.Line.prototype = new this.PointBased();
	this.Line.prototype.getName = 'Line';
	this.Line.prototype.init = function (args) {
		if (args.closed) { this.args.closed = true; }

		this.lineSetter = this.getLineSetter(args.weight);
	};

	this.Line.prototype.getLineSetter = function (weight) {
		return weight
			? (function () {
				const w = pixelUnit.createSize(weight);

				return function () {
					const thisW = w.getReal();
					const first = -Math.round(thisW / 2);
					const second = Math.round(thisW + first);
					const set = this.getColorArray();

					return function (x, y) {
						let i = first;
						let j;

						while ((i += 1) <= second) {
							j = first;
							while ((j += 1) <= second) {
								set(x + i, y + j);
							}
						}
					};
				};
			}())
			:			this.getColorArray;
	};

	this.Line.prototype.prepareSizeAndPos = function (args, reflectX, reflectY, rotate) {
		const newPoints = [];
		const { points } = args;
		let l = points.length;

		reflectX = (args.rX || false) !== reflectX;
		reflectY = (args.rY || false) !== reflectY;

		while (l--) { newPoints.push(new pixelUnit.Position(points[l], reflectX, reflectY, rotate)); }
		return {
			points: newPoints,
			LineCount: newPoints.length - 1,
		};
	};

	this.Line.prototype.draw = (function () {
		const { abs } = Math;
		const getDrawLine = function (set) {
			return function (p0, p1) { // Draw a single Lines
				let x0; let y0; let x1; let y1; let dx; let dy; let sy; let err; let
					e2;

				if (isNaN(p0.x) || isNaN(p0.y) || isNaN(p1.x) || isNaN(p1.y)) {
					window.console.log('Line with NaN found!', p0.x, p0.y, p1.x, p1.y);
					return p1;
				}

				if (p0.x > p1.x) {
					x1 = p0.x;
					y1 = p0.y;
					x0 = p1.x;
					y0 = p1.y;
				} else {
					x0 = p0.x;
					y0 = p0.y;
					x1 = p1.x;
					y1 = p1.y;
				}

				dx = abs(x1 - x0);
				dy = -abs(y1 - y0);

				sy = y0 < y1 ? 1 : -1;
				err = dx + dy;

				while (true) {
					set(x0, y0);
					if (x0 === x1 && y0 === y1) { return p1; }
					e2 = 2 * err;
					if (e2 > dy) { err += dy; x0 += 1; }
					if (e2 < dx) { err += dx; y0 += sy; }
				}
			};
		};

		return function () { // Draw all Lines
			const { args } = this;
			const p = args.points;
			let l = args.LineCount;
			let nextPoint = p[l]();
			const firstPoint = args.closed ? nextPoint : false;
			const drawLine = getDrawLine(this.lineSetter());

			while (l--) { nextPoint = drawLine(nextPoint, p[l]()); }
			if (firstPoint) { drawLine(nextPoint, firstPoint); }
		};
	}());

	// ------------------ Polygon ------------------
	this.Polygon.prototype = new this.Line();
	this.Polygon.prototype.getName = 'Polygon';
	this.Polygon.prototype.draw = (function () {
		const { abs } = Math;
		const getLineEdgeGetter = function (edgeList) {
			let i = -1;
			return function (p0, p1) { // Draw a single Lines
				let x0; let y0; let x1; let y1; let dx; let dy; let sy; let err; let e2; let first; let
					last;

				if (p0.x > p1.x) {
					x1 = p0.x;
					y1 = p0.y;
					x0 = p1.x;
					y0 = p1.y;
				} else {
					x0 = p0.x;
					y0 = p0.y;
					x1 = p1.x;
					y1 = p1.y;
				}

				// if( y0 === y1 ) { // Skip if horizontal Line
				// 	edgeList[ i += 1 ] = { x0: x0, x1:x0, y: y0 };
				// 	edgeList[ i += 1 ] = { x0: x1, x1:x1, y: y0 };
				// 	return p1;
				// }

				dx = abs(x1 - x0);
				dy = -abs(y1 - y0);
				sy = y0 < y1 ? 1 : -1;
				err = dx + dy;
				e2 = 2 * err;
				first = sy === -1;
				last = !first;

				if (first) { edgeList[i += 1] = { x0, y: y0 }; }

				while (true) {
					if (x0 === x1 && y0 === y1) { // Add List Point and Break
						if (last) {
							edgeList[i].x1 = x0;
						} else { i -= 1; edgeList.pop(); }
						return p1;
					}

					if (e2 < dx) {
						if (first) {
							edgeList[i].x1 = x0;
						} else {
							first = true;
						}

						edgeList[i += 1] = { x0: x0 + (dx ? 1 : 0), y: y0 += sy };

						err += dx;
						e2 = 2 * err;
					} else if (e2 > dy) {
						err += dy; x0 += 1;
						e2 = 2 * err;
					}
				}
			};
		};
		const getDrawRow = function (set) {
			return function (p0, p1) {
				let { x0 } = p0;
				const { x1 } = p1;
				const { y } = p1;

				do {
					set(x0, y);
				} while ((x0 += 1) <= x1);
			};
		};
		const sortFunction = function (a, b) {
			const n = b.y - a.y;
			if (n !== 0) { return n; }
			return b.x0 - a.x0;
		};

		return function () { // Draw all Lines
			const { args } = this;
			const edgeList = [];
			const colorArraySet = this.getColorArray();
			const drawRow = getDrawRow(colorArraySet);
			const getLineEdge = getLineEdgeGetter(edgeList);
			const p = args.points;
			let l = args.LineCount;
			let nextPoint = p[l](true);
			const firstPoint = nextPoint;

			while (l--) {
				nextPoint = getLineEdge(nextPoint, p[l](true));
			}

			getLineEdge(nextPoint, firstPoint); // Close the Polygon

			l = edgeList.sort(sortFunction).length;

			while ((l -= 2) >= 0) {
				drawRow(edgeList[l + 1], edgeList[l]);
			}
		};
	}());
	// ----- End Polygon

	// ------------------ Fill ------------------
	this.Fill.prototype = new this.Primitive();
	this.Fill.prototype.getName = 'Fill';

	this.Fill.prototype.init = function (args) {
		this.use = args.use;
	};

	this.Fill.prototype.prepareSizeAndPos = (function (pixelUnit) { // Prepare Size and Position Data for Basic Objects
		return function (args, reflectX, reflectY, rotate) {
			const width = (rotate ? args.sY : args.sX) || args.s;
			const height = (rotate ? args.sX : args.sY) || args.s;

			this.width = width ? new pixelUnit.Width(width) : false;
			this.height = height ? new pixelUnit.Width(height) : false;
		};
	}(pixelUnit));

	this.Fill.prototype.draw = function () {
		const color = this.getColorArray();
		const array = drawingTool.pixelSetter.getSave(this.use);
		let l = array ? array.length - 1 : -1;
		let current;

		while (l >= 0) {
			color((current = array[l--])[0], current[1]);
		}
	};
	// ----- End Fill

	// ------------------ FillRandom ------------------
	this.FillRandom.prototype = new this.Fill();
	this.FillRandom.prototype.getName = 'Random Fill';

	this.FillRandom.prototype.init = function (args) {
		const width = this.rotate ? args.sY : args.sX;
		const height = this.rotate ? args.sX : args.sY;

		this.use = args.use;
		this.chance = args.chance || 0.5;
		this.random = drawingTool.seed.get(args.seed);
		this.mask = args.mask;

		if (height && height.random) { this.heightRandom = new pixelUnit.createSize(height.random); }
		if (width && width.random) { this.widthRandom = new pixelUnit.createSize(width.random); }
		if (args.size && args.size.random) { this.sizeRandom = new pixelUnit.createSize(args.size.random); }
	};

	this.FillRandom.prototype.draw = function () {
		const width = this.width ? this.width.getReal() : 1;
		const height = this.height ? this.height.getReal() : 1;

		const sizeRandom = this.sizeRandom ? this.sizeRandom.getReal() + 1 : false;
		const heightRandom = this.heightRandom ? this.heightRandom.getReal() + 1 : false;
		const widthRandom = this.widthRandom ? this.widthRandom.getReal() + 1 : false;

		const color = this.getColorArray();
		const array = drawingTool.pixelSetter.getSave(this.use);
		const l = array ? array.length : 0;
		let count = Math.floor(l * (this.chance / ((width + (widthRandom || sizeRandom || 0) / 2) * (height + (heightRandom || sizeRandom || 0) / 2))));

		const mask = this.mask ? drawingTool.pixelSetter.getMask(this.use) : false;
		const dontCheck = !mask;
		const random = this.random().one;

		let current;
		let currentX;
		let currentY;
		let finalX;
		let finalMaskX;
		let odd = true;
		let w; let h; let realHeight;
		let randSize = 0;
		let randWidth = 0;
		let randHeight = 0;

		if (count === Infinity) {
			return;
		} if (count < Infinity && (width > 1 || height > 1 || heightRandom > 0 || widthRandom > 0 || sizeRandom > 0)) {
			while ((count--) > 0) {
				w = width + (randWidth = (widthRandom ? Math.floor(widthRandom * random()) : 0) + (randSize = (sizeRandom ? Math.floor(sizeRandom * random()) : 0)));
				realHeight = height + (randHeight = (heightRandom ? Math.floor(heightRandom * random()) : 0) + randSize);

				currentX = (current = array[Math.floor(random() * l)])[0] - ((odd = !odd) ? (width + randWidth) : 0);
				currentY = current[1] - (odd ? (height + randHeight) : 0);

				while (w--) {
					finalX = currentX + w;
					if (dontCheck || (finalMaskX = mask[finalX])) {
						h = realHeight;
						while (h--) {
							if (dontCheck || finalMaskX[currentY + h]) {
								color(
									finalX,
									currentY + h,
								);
							}
						}
					}
				}
			}
		} else {
			while ((count--) > 0) {
				color((current = array[Math.floor(random() * l)])[0], current[1]);
			}
		}
	};
	// ----- End FillRandom

	// ------------------ ShapeBased ------------------
	this.ShapeBased.prototype = new this.Primitive();
	this.ShapeBased.prototype.getName = 'ShapeBased';

	// ------------------ Rectangle ------------------
	this.Rect.prototype = new this.ShapeBased();
	this.Rect.prototype.getName = 'Rectangle';
	this.Rect.prototype.isRect = true;
	this.Rect.prototype.draw = function () {
		const dimensions = this.dimensions.calc();

		if (dimensions.checkMin()) { return; }

		this.getColorArray()({
			posX: dimensions.posX,
			posY: dimensions.posY,
			width: dimensions.width,
			height: dimensions.height,
		});
	};
	// ----- End Rectangle

	// ----- End Primitives

	// ------------------ OBJECTS ------------------
	this.Obj.prototype = new this.ShapeBased(); // Objects consist of other Objects or Primitives
	this.Obj.prototype.getName = 'Object';

	this.Obj.prototype.init = (function (drawingTool) { // Initing a new Object, converting its List into real Objects.
		const convertList = function (list, inherit) { // Loops through the List of an Object
			const l = list ? list.length : 0;
			let i = 0;
			const newList = [];
			let newTool;
			do {
				newTool = list[i];
				if (newTool) {
					newList.push(
						new drawingTool[
							newTool.name || (
								newTool.stripes
									? 'Stripes'
									: newTool.list
										? 'Obj'
										: newTool.points
											? newTool.weight ? 'Line' : 'Polygon'
											: newTool.use
												? newTool.chance ? 'FillRandom' : 'Fill'
												: newTool.panels ? 'Panels'
													: newTool.targetX ? 'Arm'
														: 'Rect'
							)
						]().create(newTool, inherit),
					);
				}
			} while ((i += 1) < l);
			return newList;
		};

		return function () {
			const { args } = this;
			const list = this.args.list || this.list;

			if (this.args.list || this.list) {
				this.args.list = convertList(
					list,
					{ // Things to inherit to Children
						color: args.color,
						clear: args.clear,
						reflectX: args.reflectX,
						reflectY: args.reflectY,
						zInd: args.zInd,
						id: args.id,
						save: args.save,
						rotate: args.rotate,
					},
				);
			}
		};
	}(drawingTool)); // ------ End Object Init

	this.Obj.prototype.draw = (function (pixelUnit) { // Draws Object, consisting of other Objects and Primitives.
		return function () {
			const { args } = this;
			const { list } = args;
			let l = list.length;
			const dimensions = this.dimensions.calc();
			let oldMask;

			if (dimensions.checkMin()) { return; }
			if (args.mask) {
				oldMask = args.mask(dimensions, true);
			}

			pixelUnit.push(dimensions);

			while (l--) {
				list[l].draw();
			}

			if (args.mask) {
				args.mask(oldMask, false);
			}

			pixelUnit.pop();
		};
	}(pixelUnit));

	// ------------------ Stripes ------------------
	this.Stripes.prototype = new this.Obj();
	this.Stripes.prototype.getName = 'Stripes';
	this.Stripes.prototype.isRect = true;
	this.Stripes.prototype.isStripe = true;
	this.Stripes.prototype.detailInit = function (args) {
		let random;
		const { stripes } = args;
		const horizontal = this.horizontal = (this.rotate ? !stripes.horizontal : stripes.horizontal) || false; // Width of a single Line
		const Dimension = (horizontal ? pixelUnit.Height : pixelUnit.Width);

		this.stripWidth = new Dimension(stripes.strip || { a: 1 }); // Width of a single Line
		this.gapWidth = new Dimension(stripes.gap || { a: 0 }); // Width of a single Line

		if (stripes.strip && stripes.strip.random) {
			this.stripWidthRandom = new pixelUnit.createSize(stripes.strip.random);
			random = true;
		}

		if (stripes.gap && stripes.gap.random) {
			this.gapWidthRandom = new pixelUnit.createSize(stripes.gap.random);
			random = true;
		}

		if (stripes.random) {
			if (typeof stripes.random === 'object') { stripes.random.height = !horizontal; }
			this.lengthRandom = new pixelUnit.createSize(stripes.random);
			random = true;
		}

		if (stripes.change) {
			if (typeof stripes.change === 'object') { stripes.change.height = !horizontal; }
			this.lengthChange = new pixelUnit.createSize(stripes.change);
			random = true;
		}

		if (random) {
			this.random = drawingTool.seed.get(stripes.seed);
		}

		this.cut = stripes.cut;
		this.overflow = stripes.overflow;
		this.round = stripes.round;
		this.fromStart = stripes.fromStart;

		this.fromOtherSide = horizontal ? this.fromBottom : this.fromRight;

		this.getDraw = horizontal
			? this.drawers.horizontal
			: this.drawers.normal;
	};

	this.Stripes.prototype.drawers = {
		normal(drawer, fromOtherSide, stripWidth, endX, startY, endY, overflow) {
			return function (startX, currentHeightChange, randomWidth) {
				const end = startX + stripWidth + randomWidth;
				const start = startY - (fromOtherSide ? currentHeightChange : 0);

				drawer({
					posX: startX,
					posY: start,
					width: ((!overflow && end > endX) ? endX : end) - startX,
					height: endY + (!fromOtherSide ? currentHeightChange : 0) - start,
				});
			};
		},
		horizontal(drawer, fromOtherSide, stripWidth, endY, startX, endX, overflow) {
			return function (startY, currentHeightChange, randomWidth) {
				const end = startY + stripWidth + randomWidth;
				const start = startX - (fromOtherSide ? currentHeightChange : 0);

				drawer({
					posX: start,
					posY: startY,
					width: endX + (!fromOtherSide ? currentHeightChange : 0) - start,
					height: ((!overflow && end > endY) ? endY : end) - startY,
				});
			};
		},
	};

	this.Stripes.prototype.draw = function () {
		const { args } = this;

		const dimensions = this.dimensions.calc();

		if (dimensions.checkMin()) { return; }

		const { fromRight } = this;
		const { fromBottom } = this;
		const { horizontal } = this;
		const { fromOtherSide } = this;
		const { cut } = this;

		let stripWidth = this.stripWidth.getReal();
		let gapWidth = this.gapWidth.getReal();
		const size = (horizontal ? dimensions.height : dimensions.width);
		let singleSX = gapWidth + stripWidth;

		if (this.round) {
			const ratio = singleSX / stripWidth;
			singleSX = Math.floor(size / Math.floor(size / singleSX));
			stripWidth = Math.round(singleSX / ratio);
			gapWidth = singleSX - stripWidth;
		}

		const lengthChange = this.lengthChange ? this.lengthChange.getReal() : 0;
		const lengthChangeStep = lengthChange / (this.horizontal ? dimensions.height : dimensions.width) * (fromOtherSide ? -1 : 1);
		let totalHeightChange = Math.round(fromOtherSide ? -lengthChangeStep : 0);

		const startX = dimensions.posX - (horizontal && fromRight && fromBottom ? lengthChange : 0);
		const startY = dimensions.posY - (!horizontal && fromRight && fromBottom ? lengthChange : 0);

		const width = dimensions.width + (horizontal && !fromRight && fromBottom ? lengthChange : 0) + (horizontal && fromRight && fromBottom ? lengthChange : 0);
		const height = dimensions.height + (!horizontal && fromRight && !fromBottom ? lengthChange : 0) + (!horizontal && fromRight && fromBottom ? lengthChange : 0);

		const endX = startX + width;
		const endY = startY + height;

		let start = 				(horizontal ? startY : startX)
				+ (fromOtherSide && !this.fromStart
				  ? Math.round((horizontal ? height : width) % singleSX) - (this.overflow ? singleSX : 0)
				  : 0
				);
		const end = horizontal ? endY : endX;

		const random = this.random ? this.random().one : false;
		const stripWidthRandom = this.stripWidthRandom ? this.stripWidthRandom.getReal() + 1 : 0;
		const gapWidthRandom = this.gapWidthRandom ? this.gapWidthRandom.getReal() + 1 : 0;
		const lengthRandom = this.lengthRandom ? this.lengthRandom.getReal() : 0;
		let randomWidth;
		let totalWidth;
		const { list } = args;
		let l;
		const length = list ? list.length : 0;

		const draw = this.getDraw(
			list ? pixelUnit.push : (this.getColorArray ? this.getColorArray() : false),
			horizontal ? fromRight : fromBottom, // From Other Side?
			stripWidth,
			end,
			horizontal ? startX : startY,
			horizontal ? endX : endY,
			this.overflow,
		);

		do {
			totalWidth = singleSX + (randomWidth = stripWidthRandom ? Math.floor(stripWidthRandom * random()) : 0) + (gapWidthRandom ? Math.floor(gapWidthRandom * random()) : 0);

			if (totalWidth < 1) { totalWidth = 1; }

			if (!cut || start + totalWidth <= end) {
				draw(
					start,
					(lengthRandom !== 0 ? Math.round(lengthRandom * random()) : 0) + (lengthChangeStep ? Math.round(totalHeightChange += lengthChangeStep * totalWidth) : 0),
					randomWidth,
				);

				if (list) {
					l = length;
					while (l--) { list[l].draw(); }

					pixelUnit.pop();
				}
			}
		} while ((start += totalWidth) < end);
	};
	// ----- End Stripes

	// ------------------ Round Rectangle ------------------
	this.RoundRect.prototype = new this.Obj();
	this.RoundRect.prototype.getName = 'Rounded Rectangle';
	this.RoundRect.prototype.list = [
		// { mY:1 },
		// { mX:1, height: {a:1} },
		// { mX:1, height: {a:1}, fromBottom:true },
		{
			minX: 3,
			minY: 4,
			list: [
				{ name: 'Dot', clear: true },
				{ name: 'Dot', fX: true, clear: true },
				{ name: 'Dot', fY: true, clear: true },
				{
					name: 'Dot', fX: true, fY: true, clear: true,
				},
			],
		},
		{
			minX: 4,
			minY: 3,
			list: [
				{ name: 'Dot', clear: true },
				{ name: 'Dot', fX: true, clear: true },
				{ name: 'Dot', fY: true, clear: true },
				{
					name: 'Dot', fX: true, fY: true, clear: true,
				},
			],
		},
		{},
	];
	// ----- End Rounded Rectangle

	// ------------------ Grid ------------------
	this.Grid.prototype = new this.Obj();
	this.Grid.prototype.getName = 'Grid';
	this.Grid.prototype.list = [
		{
			stripes: { gap: 1 },
			list: [
				{ stripes: { gap: 1, horizontal: true } },
			],
		},
	];
	// ----- End Grid

	// ------------------ Panels ------------------
	this.Panels.prototype = new this.Obj();
	this.Panels.prototype.getName = 'Panels';
	this.Panels.prototype.init = (function (pX) {
		return function (args) {
			const { panels } = args;
			let l = panels.length;
			const inherit = {};
			const newPanels = this.args.list = [];
			let current;

			while (l--) {
				current = panels[l];

				if (current.sX) { current.sX.autoUpdate = true; } else { current.sX = {}; }

				if (current.sY) { current.sY.autoUpdate = true; } else { current.sY = {}; }

				newPanels.push({
					drawer: new drawingTool.Obj().create({ list: current.list }, inherit),
					sX: current.sX,
					sY: current.sY,
				});
			}

			this.fluctuation = args.fluctuation || 0;
			this.imgRatio = args.imgRatio ? typeof args.imgRatio === 'object' ? args.imgRatio : { ratio: args.imgRatio } : 1;

			if (args.gutterX) { this.gutterSX = new pX.Width(args.gutterX); }
			if (args.gutterY) { this.gutterSY = new pX.Width(args.gutterY); }
		};
	}(pixelUnit));

	this.Panels.prototype.draw = (function () { // Draws Object, consisting of other Objects and Primitives.
		return function () {
			const { args } = this;
			const { list } = args;

			let countX;
			let countY;

			this.dimensions = this.dimensions.calc();

			this.sX = this.dimensions.width;
			this.sY = this.dimensions.height;

			this.gutterX = this.gutterSX.getReal();
			this.gutterY = this.gutterSY.getReal();

			this.countX = countX;
			this.countY = countY;

			// Find best combination of rows/cols
			this.findBestRows(list);

			const panels = this.sortRows(list);

			// calculate the finale size of the panel
			this.calcPanelsSizes(panels);

			// Draw the content of the panels
			this.drawPanels(panels, args.mask);
		};
	}(pixelUnit));

	this.Panels.prototype.findBestRows = function (list) {
		let y = 0;
		let x;
		const l = list.length;
		let current;
		const imgRatio = this.imgRatio.ratio;
		let last = {
			lastSquarness: Infinity,
			lastRatioDiff: imgRatio,
		};

		while ((y += 1) <= l) {
			x = Math.round(l / y);

			if (x * y < l) { x += 1; } // Add one to X, if it wouldn’t be enough panels

			if (x * y - x < l) {
				current = {
					x,
					y,
					singleSXWithGutter: Math.floor((this.sX + this.gutterX) / x),
					singleSYWithGutter: Math.floor((this.sY + this.gutterY) / y),
				};

				current.singleSX = current.singleSXWithGutter - this.gutterX;
				current.singleSY = current.singleSYWithGutter - this.gutterY;

				current.ratio = current.singleSXWithGutter / current.singleSYWithGutter;

				current.ratioDiff = Math.abs(current.ratio - imgRatio);
				// current.squareness = Math.abs( 1 - current.ratio );

				if (
					last.ratioDiff < current.ratioDiff
				// && last.squareness < current.squareness
				) {
					break;
				}

				last = current;
			}
		}

		this.countX = last.x;
		this.countY = last.y;

		this.singleSX = last.singleSX <= 1 ? 1 : last.singleSX;
		this.singleSY = last.singleSY <= 1 ? 1 : last.singleSY;
	};

	this.Panels.prototype.sortRows = function (list) {
		const panels = [];
		let i; let j;
		const l = list.length;
		let c = l - 1;
		let total = this.countX * this.countY;
		let odd = true;
		const priorites = [l - 1, 0, l - 1, 0, l - 1, 0, l - 1, 0, l - 1, 0, l - 1, 0, l - 1, 0, l - 1, 0, l - 1, 0, l - 1, 0, l - 1, 0, l - 1, 0, l - 1, 0, l - 1, 0, l - 1, 0, l - 1, 0];
		let current;

		i = l;

		while (i--) {
			current = list[i];

			panels.push({
				drawer: current.drawer,
				first: false,
				last: false,
				size: 1,
				sX: current.sX,
				sY: current.sY,
			});
		}

		while (total > l) {
			total -= 1;
			panels[priorites.pop()].size += 1;
		}

		j = this.countY;
		while (j--) {
			i = this.countX;
			odd = !odd;
			while ((i -= (current = panels[c]).size) >= 0) {
				current.x = i;

				current.y = j;


				if (i === 0) {
					current.first = true;
				} else if (i === this.countX - current.size) {
					current.last = true;
				} else if (c === 0) {
					current.first = true;
					current.x = 1;
				}

				current.odd = odd;

				c -= 1;
				if (c < 0) break;
			}
		}

		return panels;
	};

	this.Panels.prototype.calcPanelsSizes = function (panels) {
		let c = 0;
		const l = panels.length;
		let currentPanel;
		let x; let y;
		let size;
		let currentWidth;
		let first;
		let width = 0;
		let height = this.singleSY;
		let posX = 0;
		let posY = 0;

		do {
			currentPanel = panels[c];
			x = currentPanel.x;
			y = currentPanel.y;
			size = currentPanel.size;
			first = currentPanel.first;


			if (first) {
				posX = x * (this.singleSX + this.gutterX);

				if (y > 0) {
					posY += height + this.gutterY;

					if (y === this.countY - 1) {
						height = this.sY - posY;
					}
				}
			} else {
				posX += width + this.gutterX;
			}

			if (first && size === this.countX) {
				// If a single panel fills a whole row
				width = this.sX;
			} else if (currentPanel.last) {
				// last Panel is as wide as what’s left.
				width = this.sX - posX;
			} else {
				// Calc PanelWidth and add to total.
				if (first) {
					currentWidth = (size + (currentPanel.odd ? -this.fluctuation : this.fluctuation));
				} else {
					currentWidth = size;
				}

				width = Math.round(currentWidth * this.singleSX + (currentWidth - 1) * this.gutterX);
			}

			// Update the linked sizes of the panel
			currentPanel.sX.real = width;
			currentPanel.sY.real = height;

			currentPanel.dimensions = {
				width,
				height,
				posX: posX + this.dimensions.posX,
				posY: posY + this.dimensions.posY,
			};
		} while ((c += 1) < l);
	};

	this.Panels.prototype.drawPanels = function (panels, mask) {
		let currentPanel;
		let currentDim;
		let oldMask;
		const l = panels.length;
		let c = 0;

		do {
			currentPanel = panels[c];
			currentDim = currentPanel.dimensions;

			if (mask) { oldMask = mask(currentDim); }
			pixelUnit.push(currentDim);

			currentPanel.drawer.draw();

			pixelUnit.pop();
			if (mask) { mask(oldMask); }
		} while ((c += 1) < l);
	};
	// ----- End Panels

	// ------------------ Arm ------------------
	this.Arm.prototype = new this.Obj();
	this.Arm.prototype.getName = 'Arm';
	this.Arm.prototype.init = (function (pX) {
		return function (args) {
			let hand;

			this.targetX = args.targetX;
			this.targetY = args.targetY;

			this.endX = args.endX;
			this.endY = args.endY;

			this.jointX = args.jointX;
			this.jointY = args.jointY;

			this.length = args.length;

			this.flip = args.flip;
			this.maxStraight = args.maxStraight || 1;

			this.ratio = args.ratio || 0.5;
			this.ellbow = args.ellbow;

			this.endX.autoUpdate = true;
			this.endY.autoUpdate = true;
			this.jointX.autoUpdate = true;
			this.jointY.autoUpdate = true;

			// Upper Arm
			this.upperArm = new drawingTool.Line().create({
				weight: args.upperArmWeight || args.weight,
				color: args.upperArmColor || args.color,
				points: [
					{},
					{ x: this.jointX, y: this.jointY },
				],
				z: this.args.zInd,
			});

			if (args.upperArmLightColor) {
				this.upperArmInner = new drawingTool.Line().create({
					weight: [args.upperArmWeight || args.weight, -2],
					color: args.upperArmLightColor,
					points: [
						{},
						{ x: this.jointX, y: this.jointY },
					],
					z: this.args.zInd,
				});
			}


			// Lower Arm
			this.lowerArm = new drawingTool.Line().create({
				weight: args.lowerArmWeight || args.weight,
				color: args.lowerArmColor || args.color,
				points: [
					{ x: this.jointX, y: this.jointY },
					{ x: this.endX, y: this.endY },
				],
				z: this.args.zInd,
			});

			if (args.lowerArmLightColor) {
				this.lowerArmInner = new drawingTool.Line().create({
					weight: [args.lowerArmWeight || args.weight, -2],
					color: args.lowerArmLightColor,
					points: [
						{ x: this.jointX, y: this.jointY },
						{ x: this.endX, y: this.endY },
					],
					z: this.args.zInd,
				});
			}

			if (args.debug) {
				this.showDebug = true;
				// this.debug = new drawingTool.Rect().create({
				// 	x: this.targetX,
				// 	y: this.targetY,
				// 	s:1,
				// 	color: [255,0,0],
				// 	z: Infinity
				// });

				this.debugLowerArm = new drawingTool.Line().create({
					weight: 1,
					color: [80, 0, 0],
					points: [
						{ x: this.endX, y: this.endY },
						{ x: this.jointX, y: this.jointY },
					],
					z: Infinity,
				});

				this.debugUpperArm = new drawingTool.Line().create({
					weight: 1,
					color: [125, 0, 0],
					points: [
						{ x: this.jointX, y: this.jointY },
						{ },
					],
					z: Infinity,
				});

				this.debugArmTarget = new drawingTool.Line().create({
					weight: 1,
					color: [0, 255, 255],
					points: [
						{ x: this.endX, y: this.endY },
						{ x: this.targetX, y: this.targetY },
					],
					z: Infinity,
				});

				// this.debugEllbow = new drawingTool.Dot().create({
				// 	color:[0,150,0],
				// 	x: this.jointX,
				// 	y: this.jointY,
				// 	z: Infinity
				// });

				// this.debugEnd = new drawingTool.Dot().create({
				// 	color:[0,255,0],
				// 	x: this.endX,
				// 	y: this.endY,
				// 	z: Infinity
				// });
			}

			if ((hand = args.hand)) {
				this.handLength = new pX.createSize(args.hand.length || { r: 0.1, useSize: this.length, min: 1 });
				this.handEndX = hand.endX;
				this.handEndY = hand.endY;
				this.handTargetX = hand.targetX;
				this.handTargetY = hand.targetY;
				this.handRelativeToArm = hand.toArm || this.ellbow;
				this.handRelativeToDirection = hand.toDir;

				this.hand = new drawingTool.Line().create({
					weight: hand.width || args.lowerArmWeight || args.weight,
					color: hand.color || args.lowerArmColor || args.color,
					points: [
						{ x: this.endX, y: this.endY },
						{ x: this.handEndX, y: this.handEndY },
					],
					z: this.args.zInd,
				});

				if (this.showDebug) {
					// this.debugHandEnd = new drawingTool.Dot().create({
					// 	color:[0,0,255],
					// 	x: this.handEndX,
					// 	y: this.handEndY,
					// 	z: Infinity
					// });

					// this.debugHandTarget = new drawingTool.Dot().create({
					// 	color:[0,255,0],
					// 	x: [ this.handTargetX, this.endX ],
					// 	y: [ this.handTargetY, this.endY ],
					// 	z: Infinity
					// });

					this.debugHandTarget = new drawingTool.Line().create({
						weight: 1,
						color: [255, 255, 0],
						points: [
							{ x: this.handEndX, y: this.handEndY },
							{ x: [this.handTargetX, this.endX], y: [this.handTargetY, this.endY] },
						],
						z: Infinity,
					});
				}
			}
		};
	}(pixelUnit));

	this.Arm.prototype.draw = function () {
		const dimensions = this.dimensions.calc();

		this.fullLength = this.length.s.getReal();
		this.upperArmLength = this.fullLength * this.ratio; // c|
		this.lowerArmLength = this.fullLength - this.upperArmLength; // c||;

		if (this.ellbow) {
			this.calculateFromEllbow();
		} else {
			this.calculateFromHand();
		}

		this.endX.calculated = true;
		this.endY.calculated = true;
		this.jointX.calculated = true;
		this.jointY.calculated = true;

		// draw
		pixelUnit.push(dimensions);

		// Hand
		if (this.hand) { this.drawHand(); }

		// Debug
		if (this.showDebug) {
			if (this.debugEnd) { 		this.debugEnd.draw(); }
			if (this.debugEllbow) { 	this.debugEllbow.draw(); }
			if (this.debug) { 			this.debug.draw(); }
			if (this.debugUpperArm) { 	this.debugUpperArm.draw(); }
			if (this.debugLowerArm) { 	this.debugLowerArm.draw(); }
			if (!this.ellbow && this.debugArmTarget) { this.debugArmTarget.draw(); }
		}

		if (this.lowerArmInner) { this.lowerArmInner.draw(); }
		if (this.upperArmInner) { this.upperArmInner.draw(); }
		this.lowerArm.draw();
		this.upperArm.draw();

		pixelUnit.pop();
	};

	this.Arm.prototype.calculateFromEllbow = function () {
		const jointY = this.targetY.s.getReal();

		if (this.upperArmLength >= Math.abs(jointY)) {
			// if ellbow can reach

			this.jointX.real = Math.sqrt(Math.pow(this.upperArmLength, 2) - Math.pow(jointY, 2));
			this.jointY.real = 			this.endY.real = jointY;
			this.endX.real = this.jointX.real;
		} else {
			// if ellbow can’t reach, let it hang down
			this.jointX.real = 0;
			this.jointY.real = this.upperArmLength;

			this.endY.real = this.upperArmLength + this.lowerArmLength;

			if (this.lowerArmLength > jointY - this.upperArmLength) {
				// if hand can reach
				this.endX.real = this.upperArmLength + Math.sqrt(Math.pow(this.lowerArmLength, 2) - Math.pow(jointY - this.upperArmLength, 2));
			} else {
				// if hand can’t reach, let it hang down
				this.endX.real = 0;
			}
		}


		 // - this.lowerArmLength;

		this.straightAngle = 0.5;
	};

	this.Arm.prototype.calculateFromHand = function () {
		let	x = this.targetX.s.getReal();
		let y = this.targetY.s.getReal();
		let fullDistance = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));

		let lengthToDistanceRatio;
		let innerAngle;

		let upperArmAngle;

		// - - - - Calculate End Point
		this.fullLength *= this.maxStraight;

		if (fullDistance > 0) {
			lengthToDistanceRatio = this.fullLength / fullDistance;

			if (lengthToDistanceRatio < 1) {
				x *= lengthToDistanceRatio;
				y *= lengthToDistanceRatio;
				fullDistance *= lengthToDistanceRatio;
			}

			if (this.upperArmLength - this.lowerArmLength > fullDistance) {
				lengthToDistanceRatio = (this.upperArmLength - this.lowerArmLength) / fullDistance;
				x *= lengthToDistanceRatio;
				y *= lengthToDistanceRatio;
				fullDistance *= lengthToDistanceRatio;
			}
		}

		this.endX.real = Math.round(x);
		this.endY.real = Math.round(y);

		// - - - - Calculate Joints

		// get the angle of the straight line relative to zero
		this.straightAngle = Math.acos(
			y / fullDistance,
		);

		if (x < 1) {
			this.straightAngle *= -1;
		}

		// get the angle of the upper Arm relative to the straight line
		innerAngle = Math.acos(
			(Math.pow(this.upperArmLength, 2) + Math.pow(fullDistance - 0.001, 2) - Math.pow(this.lowerArmLength, 2))
			/ (2 * this.upperArmLength * fullDistance),
		);

		// decide direction of ellbow
		if (this.flip) {
			innerAngle *= -1;
		}

		// get the angle of the upper arm triangle
		upperArmAngle = this.straightAngle + innerAngle;

		// get one sides of the upper arm triangle
		this.jointX.real = Math.round(this.upperArmLength * Math.sin(upperArmAngle));
		this.jointY.real = Math.round(this.upperArmLength * Math.cos(upperArmAngle));

		if (isNaN(this.jointX.real)) { this.jointX.real = 0; }
		if (isNaN(this.jointY.real)) { this.jointY.real = 0; }

		this.x = x;
	};

	this.Arm.prototype.drawHand = function () {
		const endX = this.endX.real;
		const endY = this.endY.real;
		const targetX = this.handTargetX.s.getReal();
		const targetY = this.handTargetY.s.getReal();
		const length = this.handLength.getReal();
		const distance = Math.sqrt(Math.pow(targetX, 2) + Math.pow(targetY, 2));
		const ratio = length / (distance || 0.1);

		this.handEndX.real = endX + targetX * ratio;
		this.handEndY.real = endY + targetY * ratio;

		this.handEndX.calculated = true;
		this.handEndY.calculated = true;

		this.hand.draw();
		if (this.showDebug) {
			if (this.debugHandEnd) { this.debugHandEnd.draw(); }
			// this.debugHandTarget.draw();
			if (this.debugHandTarget) { this.debugHandTarget.draw(); }
		}
	};
	// ----- End Arm

	this.init = function (width, height, pixelArray) {
		pixelUnit.init({
			width,
			height,
		});

		drawingTool.pixelSetter.setArray(pixelArray);
		drawingTool.seed.reset();
	};
}

export { DrawingTools };
