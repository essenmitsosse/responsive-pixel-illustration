"use strict";

import { ColorRgb, ImageFunction } from "../PixelGraphics/types";

const backgroundColor: ColorRgb = [100, 100, 120],
	linkList = [],
	linkListPush = function (obj) {
		linkList.push(obj);

		return obj;
	},
	white = [220, 220, 255],
	red = [220, 50, 40],
	count = 5,
	width = linkListPush({ main: true }),
	height = linkListPush({ main: true, height: true }),
	heightOvershot = linkListPush({
		add: [height, { r: -1, useSize: width }],
		min: { a: 0 },
	}),
	widthOvershot = linkListPush({
		add: [width, { r: -1, useSize: height }],
		min: { a: 0 },
	}),
	smallerSide = linkListPush({
		add: [width, -count],
		max: [height, -count],
	}),
	biggerSide = linkListPush({
		add: [width, -count],
		min: [height, -count],
	}),
	stripMaxSX = linkListPush({ r: 1, useSize: biggerSide }),
	singleSY = linkListPush({ r: 1 / count, useSize: smallerSide }),
	innerSingleSY = linkListPush({ add: [singleSY, -2] }),
	stripSX_ = 0.2,
	stripSX = linkListPush({ r: 0.2, useSize: innerSingleSY }),
	whiteSX = linkListPush({
		add: [innerSingleSY, { r: -2, useSize: stripSX }],
	}),
	versions = function (size) {
		return [
			[
				{ color: white },
				{ color: red, sX: { r: stripSX_ } },
				{ color: red, sX: { r: stripSX_ }, fX: true },
			],
			[
				{ color: white },
				{ color: red, sX: stripSX },
				{ color: red, sX: stripSX, fX: true },
			],
			[{ color: red }, { color: white, sX: whiteSX, cX: true }],
			[
				{ color: white },
				{
					stripes: { strip: [whiteSX, stripSX] },
					list: [{ sX: stripSX, color: red }],
				},
			],
			[
				{ color: [0, 255, 0] },
				{
					color: red,
					sX: { r: 0.3, min: { r: 4, useSize: innerSingleSY } },
				},
				{
					color: white,
					x: stripSX,
					sX: {
						add: [
							{ r: 0.4, useSize: innerSingleSY },
							{ r: 0.4, useSize: size },
							-20,
						],
						min: whiteSX,
					},
				},
			],
		];
	},
	sizes = (function (count) {
		let i = 0,
			obj = {};

		while (i < count) {
			obj["s" + i] = linkListPush({
				r: 0,
				useSize: stripMaxSX,
				min: singleSY,
			});
			i += 1;
		}

		return obj;
	})(count),
	getSquares = function (args) {
		let list = [],
			i = 0,
			max = count;

		while (i < max) {
			list.push({
				sY: [singleSY, -1],
				sX: sizes["s" + i],
				y: { r: i, useSize: singleSY, a: 1 },
				x: 1,
				list: [
					{ color: [50, 50, 60] },
					{ m: 1, mask: true, list: versions(sizes["s" + i])[i] },
				],
			});
			i += 1;
		}

		return list;
	},
	renderList = [
		{
			sX: {
				add: [{ r: 10000, useSize: heightOvershot }],
				max: width,
			},
			sY: {
				add: [{ r: 10000, useSize: heightOvershot }],
				max: height,
			},
			color: [0, 255, 255],
			rotate: 90,
			rY: true,
			list: getSquares({ horizontal: true }),
		},
		{
			sX: { add: [{ r: 10000, useSize: widthOvershot }], max: width },
			sY: {
				add: [{ r: 10000, useSize: widthOvershot }],
				max: height,
			},
			color: [255, 0, 0],
			list: getSquares({ horizontal: false }),
		},
	];

const image: ImageFunction = {
	renderList: renderList,
	background: backgroundColor,
	linkList: linkList,
};

export default image;
