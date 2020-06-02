import { helper } from '../RenderEngine/helper';

const { getSmallerDim } = helper;
const { getBiggerDim } = helper;
const { mult } = helper;
const { sub } = helper;

const mixShadowColor = [255, 200, 255];
const shadow = helper.darken(mixShadowColor, 0.7);
const detail = helper.darken(mixShadowColor, 0.4);
const lighten = helper.lighten(mixShadowColor, 0.3);

const trees = [40, 74, 95];

const frame = lighten(trees);
const frameDark = shadow(frame);
const treesDark = shadow(trees);


const backgroundColor = detail(trees);

const teiresias = [100, 50, 60];
const teiresiasShadow = shadow(teiresias);
const stick = [90, 90, 90];
const stickDark = shadow(stick);
const stickDarkest = detail(stick);
const skin = [193, 180, 163];
const skinShadow = shadow(skin);
const eyes = detail(skin);

const snake1 = teiresias;
const snake1Detail = shadow(snake1);
const snake2 = [165, 157, 105];
const snake2Detail = shadow(snake2);
const snakeTongue = [150, 85, 94];
const snakeEyes = backgroundColor;

const shadowColor = treesDark;

const getFrame = [
	{},
	{
		mY: 1,
		color: frameDark,
		minY: 1,
		list: [
			{
				x: 'borderWidth',
				stripes: { strip: 8 },
				list: [
					{
						sX: 1, sY: 'dekoheight', fY: true, x: 2, color: trees,
					},
					{
						sX: 1, sY: 'dekoheight', fY: true, x: 6, color: trees,
					},

					{ sX: 1, sY: 'dekoheight' }, // dark
					{ sY: 1, sX: 4 }, // dark
					{ sX: 1, sY: 'dekoheight', x: 4 }, // dark
					{
						sY: 1, sX: 4, fY: true, y: 'dekoOffset', x: 4,
					}, // dark

					{
						sY: 1, sX: 4, y: 'dekoOffset', x: 2, color: trees,
					},
					{
						sY: 1, sX: 4, fY: true, x: 6, color: trees,
					},

					{
						minY: 6,
						list: [
							{ name: 'Dot', x: 6, color: trees },
							{ name: 'Dot', x: 4, fY: true },
						],
					},
				],
			},
		],
	},
];

const bigEdge = [
	{ sX: { r: 0.5 } },
	{ sY: { r: 0.5 }, fY: true },
	{
		points: [
			{ x: { r: 0.5 } },
			{ y: { r: 0.5 }, fY: true, fX: true },
			{ x: { r: 0.5 }, y: { r: 0.5 } },
		],
	},
	{
		m: 1,
		list: [
			{
				name: 'Line',
				closed: true,
				color: frameDark,
				points: [
					{},
					{ x: { r: 0.4 } },
					{ y: { r: 0.4 }, fX: true, fY: true },
					{ fY: true, fX: true },
					{ fY: true },
				],
			},
			{
				name: 'Dot', color: trees, fY: true, x: 2, y: 2,
			},
		],
	},

];

const hair = [255, 255, 255];

let i = 0;

const snake = (nr, vert) => {
	const x = !vert ? ['snakeWeight', -1] : undefined;
	const y = vert ? ['snakeWeight', -1] : undefined;
	const s = { r: 1, add: [sub('snakeWeight')] };

	return nr === 2
		? [
			{ save: 'snake2' },
		]
		:			[
			{ color: snake1Detail },
			{ sX: 1 },
			vert ? { sX: 1, fX: true } : undefined,
			{ sY: 1 },
			{ sY: 1, fY: true },
			{
				stripes: { strip: 1, gap: 'snakeDetailSize', horizontal: vert }, x, y, sY: vert ? s : undefined, sX: !vert ? s : undefined,
			},
		];
};

const treeTrunk = () => {
	const name = `treeBark${i += 1}`;

	return [
		{ use: name },
		{
			use: name, color: stickDarkest, sY: 6, chance: 0.2,
		},
		{ save: name },
		{ sY: { r: 0.45 }, color: stickDarkest, stripes: { random: 'treeRandom', strip: 2 } },
		{
			sY: 1, y: { r: 0.4 }, tX: true, sX: { r: 0.5, max: 5 }, color: stickDarkest,
		},
	];
};

const treeLeaves = (random) => {
	const name = `treeLeaves${i += 1}`;
	const name2 = `treesSpots${i}`;
	return [
		{
			sY: { r: 1.2 }, stripes: { strip: 2, random: 'treeRandom' }, color: treesDark, change: random,
		},
		{ use: name },
		{
			use: name2, color: treesDark, chance: 0.2, sY: 2,
		},
		{
			use: name, save: name2, chance: 0.4, s: 4, mask: true,
		},
		{ stripes: { strip: 2, random: 'treeRandom', change: random }, save: `treeLeaves${i}` },
	];
};

const shadowGround = [
	{
		sY: { r: 0.5 }, y: { r: 0.5 }, fY: true, stripes: { strip: 2, random: { r: 0.3 } },
	},
	{ sY: { r: 0.5 }, y: { r: 0.5 }, stripes: { strip: 2, random: { r: 0.15 } } },
];

const torsoMargin = 0.4;
const torsoTop = 0.35;

const renderList = [
	// IMAGE
	{
		m: 'borderWidth',
		list: [

			{
				sX: { add: ['imgWidth', mult(-3, 'teiresias')], min: { r: 0.15 } },
				color: treesDark,
				list: [
					{
						stripes: {
							strip: 2, change: { r: -1 }, random: { r: 0.1 }, horizontal: true,
						},
						fY: true,
					},
				],
			},
			{
				fX: true,
				sX: { add: ['imgWidth', mult(-1.5, 'teiresias')], min: { r: 0.15 } },
				sY: { r: 2 },
				fY: true,
				color: treesDark,
				list: [
					{
						stripes: {
							strip: 2, change: { r: -1 }, random: { r: 0.05 }, horizontal: true,
						},
						fY: true,
						fX: true,
					},
				],
			},

			// Tree Trunks
			{
				color: stickDark, sX: { add: ['imgWidth', mult(-2, 'teiresias')] }, fX: true, list: treeTrunk(),
			},
			{ color: stickDark, sX: { add: [mult(0.2, 'imgWidth'), mult(-0.5, 'teiresias')] }, list: treeTrunk() },

			// Trees Left
			{
				sY: { r: 0.05 }, fX: true, sX: { add: ['imgWidth', mult(-0.5, 'teiresias')], min: { r: 0.3, otherDim: true } }, color: trees, list: treeLeaves({ r: 2 }),
			},
			{
				sY: { r: 0.4 }, fX: true, sX: { add: ['imgWidth', mult(-1.2, 'teiresias')] }, color: trees, list: treeLeaves,
			},

			// Tree Right
			{
				sY: { r: 0.3 }, sX: { add: [mult(0.2, 'imgWidth'), mult(-0.3, 'teiresias')], min: { r: 0.1, otherDim: true } }, color: trees, list: treeLeaves({ r: -0.8 }),
			},

			// Ground
			{ use: 'ground', color: trees },
			{ use: 'ground', chance: 0.01, color: treesDark },
			{
				sY: { r: 0.2 },
				fY: true,
				list: [
					{ stripes: { strip: 2, change: { r: -1 }, random: { r: 0.1 } }, fY: true, save: 'ground' },
					{
						stripes: { strip: 2, change: { r: -0.5 }, random: { r: 0.1 } }, fX: true, fY: true, save: 'ground',
					},
				],
			},

			// MOTIVE
			{
				m: 'imgPadding',
				list: [

					{
						y: mult(0.5, 'imgPadding'),
						list: [
							// TEIRESIAS Shadow
							{
								color: shadowColor,
								sX: 'teiresias',
								sY: 'imgPadding',
								x: 'teiresiasX',
								fY: true,
								list: [
									{ mX: { r: 0.6, useSize: 'torsoMargin' }, x: { r: 0.1 }, list: shadowGround },
								],
							},

							// SNAKES Shadow
							{
								color: shadowColor, sX: 'snakeWidth', sY: 'imgPadding', fY: true, fX: true, mX: 'snakeWeight', list: shadowGround,
							},
						],
					},

					// TEIRESIAS
					{
						color: teiresias,
						s: 'teiresias',
						x: 'teiresiasX',
						y: 'teiresiasY',
						list: [
							// STICK
							{ use: 'stick', color: stick },
							{
								use: 'stick', color: stickDark, chance: 0.2, sX: 'stickWeight', mask: true,
							},
							{
								name: 'Line',
								save: 'stick',
								weight: 'stickWeight',
								points: [
									{ y: ['stickLeft', 'stickWeight'] },
									{ x: { r: 0.2 }, y: 'handLeft' },
									{ x: { r: 0.5 }, y: [mult(0.4, 'stickLeft'), mult(0.4, 'stickRight')] },
									{ x: { r: 0.2 }, y: 'handRight', fX: true },
									{ y: ['stickRight', sub('stickWeight')], fX: true },
								],
							},

							{
								name: 'Line',
								save: 'stick',
								weight: mult(0.7, 'stickWeight'),
								points: [
									{ x: { r: 0.15 }, y: 'stickPoint' },
									{ x: { r: 0.01 }, y: ['stickPoint', 'stickWeight'] },
								],
							},

							{
								name: 'Line',
								weight: 'armWeight',
								color: skin,
								points: [
									{ x: { r: 0.2 }, y: 'handLeft' },
									{ x: { r: 0.18 }, y: ['handLeft', 'armLength'] },
									{ x: 'torsoMargin', y: { r: torsoTop } },
								],
							},

							{
								name: 'Line',
								weight: 'armWeight',
								color: skin,
								points: [
									{ x: { r: 0.2 }, y: 'handRight', fX: true },
									{ x: { r: 0.18 }, y: ['handRight', 'armLength'], fX: true },
									{ x: 'torsoMargin', y: { r: torsoTop }, fX: true },
								],
							},

							// HANDS
							{
								color: skin, s: 'handSize', x: { r: 0.2 }, y: ['handLeft', 'halfHandSizeNeg'],
							},
							{
								color: skin, s: 'handSize', x: { r: 0.2 }, y: ['handRight', 'halfHandSizeNeg'], fX: true,
							},

							// LEGS
							{
								name: 'Line',
								weight: 'armWeight',
								color: skin,
								points: [
									{ x: 'feetLeftX', y: ['feetLeftY', 'handSize'], fY: true }, // Left Foot
									{ x: 'kneeLeftX', y: 'kneeLeftY', fY: true }, // Left Knee
								],
							},

							{
								name: 'Line',
								weight: 'armWeight',
								color: skin,
								points: [
									{
										x: 'feetRightX', y: ['feetRightY', 'handSize'], fX: true, fY: true,
									}, // Right Foot
									{
										x: 'kneeRightX', y: 'kneeRightY', fX: true, fY: true,
									}, // Right Knee
								],
							},

							// FEETS
							{
								color: skin, s: 'handSize', x: 'feetLeftX', y: 'feetLeftY', fY: true,
							},
							{
								color: skin, s: 'handSize', x: 'feetRightX', y: 'feetRightY', fY: true, fX: true, tX: true,
							},

							// SKIRT
							{
								points: [
									{ x: 'torsoMargin', y: 'torsoBottom' }, // Left Hip
									{ x: 'torsoMargin', y: 'torsoBottom', fX: true }, // Right Hip
									{
										x: ['kneeRightX', sub('armWeight')], y: ['kneeRightY', 'armWeight'], fX: true, fY: true,
									}, // Right Knee
									{
										x: ['skirtRightX', sub('armWeight')], y: 'skirtRightY', fX: true, fY: true,
									}, // Middle Right
									{ x: ['skirtLeftX', sub('armWeight')], y: 'skirtLeftY', fY: true }, // Middle Left
									{ x: ['kneeLeftX', sub('armWeight')], y: ['kneeLeftY', 'armWeight'], fY: true }, // Left Knee
								],
							},

							{
								name: 'Line',
								color: teiresiasShadow,
								points: [
									{ x: ['skirtLeftX', mult(2, 'armWeight')], y: ['skirtLeftY', mult(2, 'armWeight')], fY: true },
									{
										x: ['skirtRightX', mult(4, 'armWeight')], y: ['skirtRightY'], fX: true, fY: true,
									},
								],
							},

							{
								name: 'Line',
								color: teiresiasShadow,
								points: [
									{ x: ['skirtLeftX', mult(4, 'armWeight')], y: ['skirtLeftY', mult(5, 'armWeight')], fY: true },
									{
										x: ['skirtRightX', mult(2, 'armWeight')], y: ['skirtRightY', mult(2.5, 'armWeight')], fX: true, fY: true,
									},
								],
							},

							// TORSO
							{
								mX: 'torsoMargin',
								sY: 'torsoheight',
								y: 'torsoY',
								list: [
									{
										sY: { r: 1, a: 1 },
										list: [
											{ color: skin },
											{
												points: [
													{ y: -2 },
													{ fY: true },
													{ fY: true, fX: true },
													{ y: { r: 0.3 }, fX: true },
												],
											},
											{
												fX: true, tX: true, y: { r: 0.35, a: 1 }, sY: { r: 0.25 }, sX: { r: 0.02, useSize: 'sXRest', max: { r: 0.05, useSize: 'teiresias' } },
											},
										],
									},

									// Belt
									{
										color: snake2,
										sY: { r: 0.1 },
										fY: true,
										stripes: { gap: 1, strip: { r: 0.2, a: -1, min: 2 }, change: { r: 0.05 } },
										list: [
											{ sY: { r: 1, otherDim: true } },
										],
									},

									// Head
									{
										color: skin,
										tY: true,
										mX: { r: 0.25 },
										id: 'head',
										list: [
											{ name: 'Dot', clear: true },
											{ name: 'Dot', clear: true, fX: true },

											{},

											// Hair
											{
												sX: 1,
												y: 2,
												minY: { r: 0.5 },
												tX: true,
												color: hair,
												sY: { r: 0, add: [mult(1, 'sXRest')], max: { r: 5 } },
												list: [
													{ stripes: { strip: 1, random: { r: -1 } } },
												],
											},

											{
												color: hair,
												sY: { r: 0.2, add: [mult(-0.5, 'sYRest')] },
												list: [
													{ stripes: { strip: 1, random: { r: -1 } } },
												],
											},

											// Mouth
											{
												color: hair,
												y: { r: 0.8 },
												list: [
													{
														color: skinShadow,
														sY: { r: 0.15 },
														y: 1,
														tY: true,
														mX: { r: 0.2 },
														list: [
															{
																name: 'Line',
																points: [
																	{ fY: true },
																	{ x: { r: 0.35 } },
																	{ x: { r: 0.35 }, fX: true },
																	{ fY: true, fX: true },
																],
															},
														],
													},

													// Beard
													{
														sY: { r: 2, add: [mult(-1.5, 'sXRest')] },
														list: [
															{ stripes: { strip: 1, random: { r: -0.8 } } },
															{
																sY: { r: 1, max: { r: 0.5, otherDim: true } },
																tY: true,
																list: [
																	{ stripes: { strip: 1, random: { r: -1 } }, fY: true },
																],
															},
														],
													},
												],
											},

											// EYES

											{
												color: eyes,
												sY: 1,
												y: { r: 0.4 },
												mX: { r: 0.1, min: 1 },
												list: [
													// Eyesbrows
													{
														color: hair,
														sY: { r: 0.4, otherDim: true },
														minY: 2,
														tY: true,
														list: [
															{
																name: 'Line',
																points: [
																	{},
																	{ x: { r: 0.5 }, fY: true },
																	{ fX: true },
																],
															},
														],
													},
													{ sX: { r: 0.4, min: 1 } },
													{ sX: { r: 0.4, min: 1 }, fX: true },
												],
											},
										],
									},
								],
							},
						],
					},

					// Snakes
					{
						color: snake1,
						sX: 'snakeWidth',
						sY: 'snakeheight',
						fY: true,
						fX: true,
						mX: 'snakeWeight',
						id: 'snakes',
						list: [

							// ROUND EDGES
							{ name: 'Dot', clear: true },
							{ name: 'Dot', clear: true, fY: true },

							{
								x: mult(2, 'snakePeriode'),
								minY: 5,
								sX: { r: 1, add: [sub('snakePeriode')] },
								stripes: { strip: 'snakePeriode', gap: 'snakePeriode', cut: true },
								list: [
									{
										name: 'Dot', clear: true, x: ['snakePeriodeHalf', 'snakeWeight', -1], y: 'snakeOffset',
									},
									{
										name: 'Dot', clear: true, x: 'snakePeriodeHalf', fY: true,
									},
									{ name: 'Dot', clear: true },
									{
										name: 'Dot', clear: true, x: ['snakeWeight', -1], y: 'snakeOffset', fY: true,
									},
								],
							},

							{
								x: 'snakePeriode',
								stripes: { strip: 'snakePeriode', gap: 'snakePeriode', cut: true },
								list: [
									{
										minY: 5,
										list: [
											{ name: 'Dot', clear: true, x: ['snakeWeight', -1] },
											{
												name: 'Dot', clear: true, fY: true, y: 'snakeOffset',
											},
											{
												name: 'Dot', clear: true, fY: true, x: ['snakePeriodeHalf', 'snakeWeight', -1],
											},
											{
												name: 'Dot', clear: true, x: 'snakePeriodeHalf', y: 'snakeOffset',
											},
										],
									},
								],
							},

							// COLOR SNAKE 2
							{ use: 'snake2', color: snake2 },
							{
								use: 'snake2', color: snake2Detail, sX: { a: 'snakeDetailSize', min: 1 }, mask: true, chance: 0.1,
							},

							// HEADS
							{ sY: 'snakeWeight', sX: 'snakePeriode', list: snake(1) },
							{
								sX: 'snakeWeight',
								list: [
									{ sY: 'snakeHeadPos', list: snake(1, true) },
									{
										y: 'snakeHeadPos',
										sY: 'snakeHeadSize',
										cX: true,
										sX: 'snakeHeadSize',
										list: [
											{},
											{
												sY: 1, color: snake1Detail, mX: 1, y: { r: 0.2 },
											},
											{
												sY: 1, color: snake1Detail, mX: 1, y: { r: 0.4 },
											},
											{
												name: 'Dot', color: snakeEyes, y: { r: 0.5 }, x: { r: 0.2 },
											},
											{
												name: 'Dot', color: snakeEyes, y: { r: 0.5 }, x: { r: 0.2 }, fX: true,
											},
											{
												sX: 1,
												color: snakeTongue,
												sY: 'snakeTongueLength',
												fY: true,
												x: { r: 0.45 },
												tY: true,
												list: [
													{ sY: { r: 1, a: -1 } },
													{ name: 'Dot', fY: true, x: -1 },
													{ name: 'Dot', fY: true, x: 1 },
												],
											},
										],
									},
								],
							},

							{
								sY: 'snakeWeight', sX: ['snakePeriode', 'snakeWeight', 1], list: snake(2), fY: true,
							},
							{
								sX: 'snakeWeight',
								list: [
									{ sY: 'snakeHeadPos', list: snake(2, true), fY: true },
									{
										y: 'snakeHeadPos',
										sY: 'snakeHeadSize',
										cX: true,
										sX: 'snakeHeadSize',
										fY: true,
										list: [
											{ save: 'snake2' },
											{
												name: 'Dot', color: snakeEyes, y: { r: 0.5 }, x: { r: 0.2 },
											},
											{
												name: 'Dot', color: snakeEyes, y: { r: 0.5 }, x: { r: 0.2 }, fX: true,
											},
											{
												sX: 1,
												color: snakeTongue,
												sY: 'snakeTongueLength',
												x: { r: 0.45 },
												fX: true,
												tY: true,
												list: [
													{},
													{ name: 'Dot', tY: true, x: -1 },
													{ name: 'Dot', tY: true, x: 1 },
												],
											},
										],
									},
								],
							},

							// SNAKE BODIES
							{
								x: mult(2, 'snakePeriode'),
								sX: { r: 1, add: [sub('snakePeriode')] },
								stripes: { strip: 'snakePeriode', gap: 'snakePeriode', cut: true },
								list: [
									{ sX: 'snakeWeight', sY: 'snakeheightReal', list: snake(1, true) },
									{ sY: 'snakeWeight', list: snake(1) },

									{ use: 'snake2', save: 'upperSnake2' },
									{
										sX: 'snakeWeight', sY: 'snakeheightReal', x: 'snakePeriodeHalf', fY: true, color: snake2, list: snake(2, true),
									},
									{
										sY: 'snakeWeight', fY: true, x: 'snakePeriodeHalf', color: snake2, list: snake(2),
									},
								],
							},

							{
								x: 'snakePeriode',
								stripes: { strip: 'snakePeriode', gap: 'snakePeriode', cut: true },
								list: [
									{ use: 'snake2', clear: true },
									{
										sX: 'snakeWeight', sY: 'snakeheightReal', x: 'snakePeriodeHalf', fY: true, color: snake2, list: snake(2, true),
									},
									{
										sY: 'snakeWeight', x: 'snakePeriodeHalf', y: 'snakeOffset', color: snake2, list: snake(2),
									},
									{ sX: 'snakeWeight', sY: 'snakeheightReal', list: snake(1, true) },
									{
										sY: 'snakeWeight', y: 'snakeOffset', fY: true, list: snake(1),
									},
								],
							},
						],
					},

					// { color:[255,0,0], sY:10, sX:"sXRest" },
					// { color:[255,255,0], y:12, sY:10, sX:"sYRest" },
				],
			},
		],
	}, // END IMAGE

	// FRAME
	{
		color: frame,
		list: [
			{ sY: 'borderWidth', list: getFrame },
			{ sY: 'borderWidth', fY: true, list: getFrame },
			{
				sX: 'borderWidth', list: getFrame, rotate: -90, rX: true,
			},
			{
				sX: 'borderWidth', fX: true, list: getFrame, rotate: 90,
			},
			{
				s: 'borderWidth',
				list: [
					{},
					{
						m: 1,
						color: frameDark,
						list: [
							{
								sX: 1, fX: true, x: 'dekoOffset', fY: true, tY: true, sY: 'dekoheight', y: ['dekoOffset', 1],
							},
							{
								sY: 1, fX: true, y: 'dekoOffset', fY: true, tX: true, sX: 'dekoheight', x: ['dekoOffset', 1],
							},
							{
								sX: 1, color: trees, fX: true, fY: true, tY: true, sY: 4,
							},
							{
								sY: 1, color: trees, fX: true, fY: true, tX: true, sX: 5, x: 1,
							},
							{ name: 'Dot', color: trees },
							{ name: 'Dot', x: 'dekoheight' },
							{ name: 'Dot', y: 'dekoheight' },
						],
					},
				],
			},
			{ s: 'bigEdgeSize', fY: true, list: bigEdge },
			{
				s: 'bigEdgeSize', fX: true, list: bigEdge, rotate: 180,
			},
			{
				s: 'borderWidth',
				fX: true,
				fY: true,
				list: [
					{},
					{
						m: 1,
						color: trees,
						list: [
							{ sX: 1 },
							{ sX: 1, fX: true },
							{ sY: 1 },
							{ sY: 1, fY: true },
						],
					},
				],
			},
		],
	},
];

const imgDims = ['imgWidth', 'imgheight'];
const motiveDims = ['motiveWidth', 'motiveheight'];

const variableList = {
	fullRect: { r: 1, max: { r: 1, height: true } },
	borderWidth: {
		r: 0.06, a: 1, useSize: 'fullRect', min: 1,
	},
	borderInner: ['borderWidth', -4],
	dekoOffset: mult(0.4, 'borderInner'),
	dekoheight: ['borderWidth', -2, sub('dekoOffset')],
	bigEdgeSize: mult(2, 'borderWidth'),

	imgWidth: [{ r: 1 }, mult(-2, 'borderWidth')],
	imgheight: [{ r: 1, height: true }, mult(-2, 'borderWidth')],

	imgSqu: getSmallerDim({ r: 1, useSize: imgDims }),
	imgSquBigger: getBiggerDim({ r: 1, useSize: imgDims }),

	imgPadding: mult(0.05, 'imgSqu'),

	motiveWidth: ['imgWidth', mult(-2, 'imgPadding')],
	motiveheight: ['imgheight', mult(-2, 'imgPadding')],

	motiveSqu: getSmallerDim({ r: 1, useSize: motiveDims }),
	motiveSquBigger: getBiggerDim({ r: 1, useSize: motiveDims }),

	sXRest: { add: ['motiveWidth', sub('motiveSqu')], min: 0 },
	sYRest: { add: ['motiveheight', sub('motiveSqu')], min: 0 },

	teiresias: { a: 'motiveSqu', max: mult(0.6, 'motiveSquBigger') },
	teiresiasX: mult(0.1, 'sXRest'),
	teiresiasY: mult(0.1, 'sYRest'),

	armLength: mult(0.2, 'teiresias'),
	armWeight: { r: 0.025, useSize: 'teiresias', min: 1 },

	maxStick: mult(0.3, 'teiresias'),
	stickLeft: { r: 0.5, useSize: 'sXRest', max: 'maxStick' },
	stickRight: { r: 0.5, useSize: 'sYRest', max: 'maxStick' },
	stickWeight: { r: 0.03, useSize: 'teiresias', min: 1 },
	stickPoint: [mult(0.85, 'stickLeft'), mult(0.15, 'stickRight')],

	torsoY: { r: torsoTop, useSize: 'teiresias' },
	torsoheight: { r: 0.2, useSize: 'teiresias' },
	torsoBottom: ['torsoY', 'torsoheight'],

	legLength: mult(1.3, 'armLength'),

	handSize: mult(1.5, 'stickWeight', 1),
	halfHandSizeNeg: mult(-0.5, 'handSize'),
	handLeft: [mult(0.8, 'stickLeft'), mult(0.2, 'stickRight')],
	handRight: [mult(0.2, 'stickLeft'), mult(0.8, 'stickRight')],

	torsoMargin: { r: torsoMargin, useSize: 'teiresias' },

	feetLeftX: 'torsoMargin',
	feetRightX: { r: 0.2, useSize: 'teiresias' },

	feetLeftY: { a: 0 },
	feetRightY: {
		r: 0.2, useSize: 'teiresias', add: [sub('sYRest')], min: 2,
	},

	kneeRightX: ['feetRightX', { add: [mult(-0.5, 'sYRest')], min: { r: -0.02 } }],
	kneeRightY: ['feetRightY', 'legLength'],

	kneeLeftX: ['feetLeftX', { add: [mult(-0.5, 'sYRest')], min: { r: -0.1 } }],
	kneeLeftY: ['feetLeftY', 'legLength'],

	skirtRightX: [mult(0.5, 'feetRightX'), mult(0.5, 'kneeRightX')],
	skirtRightY: [mult(0.5, 'feetRightY'), mult(0.5, 'kneeRightY')],

	skirtLeftX: [mult(0.5, 'feetLeftX'), mult(0.5, 'kneeLeftX')],
	skirtLeftY: [mult(0.5, 'feetLeftY'), mult(0.5, 'kneeLeftY')],

	snakeheight: { add: ['motiveheight', sub('teiresias'), sub('teiresiasY')], min: { add: [mult(0.3, 'motiveSquBigger')], min: 6, max: mult(0.4, 'motiveheight') }, max: mult(0.3, 'motiveheight') },
	snakeWidth: { add: ['motiveWidth', sub('teiresias'), sub('teiresiasX')], min: { add: [mult(0.5, 'motiveSquBigger')], max: { a: 'motiveWidth' } } },
	snakeSqu: getSmallerDim({ r: 1, useSize: ['snakeheight', 'snakeWidth'] }),
	snakeWeight: { r: 0.07, useSize: 'snakeSqu', min: 1 },

	snakeheightMargin: ['snakeheight'],
	snakeWidthMargin: ['snakeWidth', mult(-2, 'snakeWeight')],

	snakePeriode: [{ r: 2, useSize: 'snakeWeight', a: 2 }],
	snakePeriodeHalf: mult(0.5, 'snakePeriode'),
	snakeOffset: {
		r: 1, useSize: 'snakeWeight', a: 1, max: mult(0.1, 'snakeheight'),
	},
	snakeheightReal: ['snakeheightMargin', sub('snakeOffset')],

	snakeHeadSize: { r: 1.5, useSize: 'snakeWeight', min: 2 },
	snakeTongueLength: { r: 0.7, useSize: 'snakeHeadSize', min: 2 },

	snakeDetailSize: ['snakeWeight', -2],
	snakeHeadPos: { add: [mult(0.5, 'snakeheight'), mult(-1.5, 'snakeHeadSize'), sub('snakeTongueLength'), -2], min: { a: 0 } },

	treeRandom: mult(0.1, 'imgheight'),

};

export const imageFunctionTeiresias = {
	renderList,
	variableList,
	background: backgroundColor,
};
