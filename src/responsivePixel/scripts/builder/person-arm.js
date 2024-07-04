/* global Builder */

// ARM --------------------------------------------------------------------------------
Builder.prototype.Arm = function (args) {
  // Form & Sizes
  this.armSX = this.IF(0.8) ? 0.04 : this.R(0, 0.1);

  this.armSY = this.R(0.4, 0.6);
  if (args.demo && args.arm) {
    this.armSY = args.arm;
  }

  this.upperArmSY = this.R(0.2, 0.8);

  this.sleeves = args.sleeves = !args.topless && this.IF(0.95);

  if (this.sleeves) {
    this.sleeveSY = this.R(0, 1);
    this.upperSleeveSY =
      this.upperArmSY > this.sleeveSY ? this.sleeveSY : "full";
    this.lowerSleeveSY =
      this.upperArmSY > this.sleeveSY ? false : this.sleeveSY - this.upperArmSY;
    this.fullUpper = this.upperSleeveSY === "full";
  }

  this.vest = args.sleeves && this.IF();

  this.shirt = this.sleeves && args.shirt;

  // Colors
  this.skinColor = args.skinColor;
  this.shirtColor = args.shirtColor;

  // Assets
  this.shoulderPad = this.IF(0.05) && new this.basic.ShoulderPad(args);
  this.toolLeft =
    (args.demo || this.IF(0.1)) &&
    (this.IF(0.5) ? new this.basic.Shield(args) : new this.basic.Sword(args));
  this.toolRight =
    !args.demo &&
    this.IF(0.1) &&
    (this.IF(0.5)
      ? new this.basic.Shield(args, true)
      : new this.basic.Sword(args, true));

  this.headGear = args.headGear;
}; // END Arm
Builder.prototype.Arm.prototype = new Builder.prototype.Object();
Builder.prototype.Arm.prototype.draw = function (args, rightSide, behind) {
  const { nr } = args;
  const { sideView } = args;
  const name = rightSide ? "right" : "left";
  const nrName = name + nr;
  const renderFromRight = sideView ? rightSide : args.right !== args.backView;

  const tool = rightSide ? this.toolRight : this.toolLeft;
  const otherHand = !rightSide ? this.toolRight : this.toolLeft;
  const finger = args.finger && args.finger[name];

  const shoulderAngle = ((args.shoulder && args.shoulder[name]) || 0) * Math.PI;
  const armAngle =
    ((args.arm && args.arm[name]) || 0) * Math.PI + shoulderAngle;

  let fullAngle = (armAngle / Math.PI) * 180;

  const upperZ = shoulderAngle < 1.5 ? -150 : 0;

  if (fullAngle > 180) {
    fullAngle -= 360;
  } else if (fullAngle < -180) {
    fullAngle += 360;
  }

  if (args.calc) {
    args.armSX = this.pushLinkList({
      r: this.armSX,
      useSize: args.personHalfSX,
      min: 1,
    });

    args.armBasicSY = this.pushLinkList({ r: 1, useSize: args.fullBodySY });
    args.armSY = this.pushLinkList({
      r: this.armSY,
      useSize: args.armBasicSY,
    });

    args.shoulderSX = this.pushLinkList([args.armSX]);
    args.shoulderSY = this.pushLinkList({
      r: 1,
      useSize: args.armSX,
      min: 1,
      max: args.chestSY,
    });
    args.shoulderFullSX = this.pushLinkList([
      this.mult(sideView ? 2 : 1, args.shoulderSX),
      args.chestSX,
    ]);

    args.handSX = this.pushLinkList({
      add: [args.armSX, 1],
      min: 1,
      max: { r: 0.1, useSize: args.personHalfSX },
    });
    args.handHalfNegSX = this.pushLinkList({
      r: -0.5,
      useSize: args.handSX,
    });

    args.upperArmSY = this.pushLinkList({
      r: this.upperArmSY,
      useSize: args.armSY,
    });
    args.lowerArmSY = this.pushLinkList([
      args.armSY,
      this.sub(args.upperArmSY),
    ]);

    if (this.sleeves) {
      if (!this.fullUpper) {
        args.upperSleeveSY = this.pushLinkList({
          r: this.upperSleeveSY,
          useSize: args.armSY,
        });
      } else {
        args.lowerSleeveSY = this.pushLinkList({
          r: this.lowerSleeveSY,
          useSize: args.armSY,
        });
      }
    }

    this.simpleAddHoverChange(0.3, 2.5, "arm-length", args.armBasicSY);
  }

  args[`armHalfSX${nrName}`] = this.pushLinkList({
    r: renderFromRight ? 0.49 : 0.51,
    useSize: args.armSX,
    max: {
      r: 0.22,
      useSize: args.upperBodySX,
      a: renderFromRight ? -1 : 0,
    },
  });

  args[`upperArmX${nrName}`] = this.pushLinkList({
    r: Math.sin(shoulderAngle),
    useSize: args.upperArmSY,
  });
  args[`upperArmY${nrName}`] = this.pushLinkList({
    r: Math.cos(shoulderAngle),
    useSize: args.upperArmSY,
  });

  args[`lowerArmX${nrName}`] = this.pushLinkList({
    r: Math.sin(armAngle),
    useSize: args.lowerArmSY,
  });
  args[`lowerArmY${nrName}`] = this.pushLinkList({
    r: Math.cos(armAngle),
    useSize: args.lowerArmSY,
  });

  if (this.sleeves) {
    if (!this.fullUpper) {
      args[`upperSleeveX${nrName}`] = this.pushLinkList({
        r: Math.sin(shoulderAngle),
        useSize: args.upperSleeveSY,
      });
      args[`upperSleeveY${nrName}`] = this.pushLinkList({
        r: Math.cos(shoulderAngle),
        useSize: args.upperSleeveSY,
      });
    } else {
      args[`lowerSleeveX${nrName}`] = this.pushLinkList({
        r: Math.sin(armAngle),
        useSize: args.lowerSleeveSY,
      });
      args[`lowerSleeveY${nrName}`] = this.pushLinkList({
        r: Math.cos(armAngle),
        useSize: args.lowerSleeveSY,
      });
    }
  }

  return {
    sX: args.shoulderSX,
    sY: args.armSY,
    tX: true,
    fX: !behind,
    rX: behind,
    id: args[`shoulder${nrName}`],
    color: this.vest
      ? this.shirtColor.get()
      : !this.sleeves && this.skinColor.get(),
    z: 1000,
    list: [
      // Shoulder
      {
        sX: args.shoulderSX,
        sY: args.shoulderSY,
        z: upperZ,
      },

      this.shoulderPad && this.shoulderPad.draw(args, 10),

      // // Turn Checkers
      // { 	s:5, z:1000000, color: args.right ? [0,255,0]: [255,0,0], tX: true, fX: true, list: [ {},
      // 		{
      // 			s:1,
      // 			color: [0,0,0],
      // 			fY: fullAngle < 90 && fullAngle > -90,
      // 			fX: fullAngle > 0,
      // 			cX:( fullAngle < 22.5 && fullAngle > -22.5 ) || ( fullAngle > 157.5 || fullAngle < -157.5 ),
      // 			cY:( fullAngle > 67.5 && fullAngle < 112.5 ) || ( fullAngle < -67.5 && fullAngle > -112.5 )
      // 		}
      // ]},
      // { 	s:5, x:5, z:1000000, color: args.right ? [0,150,0]: [150,0,0], tX: true, fX: true,
      // 	rotate: ( fullAngle > 45 ?
      // 		fullAngle < 135 ?
      // 			-90
      // 			: -180
      // 		: fullAngle < -45 ?
      // 			fullAngle > -135 ?
      // 				90
      // 				: 180
      // 			: 0 ) * ( renderFromRight ? -1: 1 ),
      // 	list: [
      // 		{},
      // 		{
      // 			fY: true,
      // 			cX: true,
      // 			s:1,
      // 			color: [0,0,0],
      // 		}
      // ]},

      {
        fX: true,
        x: {
          add: [this.sub(args[`armHalfSX${nrName}`])],
          a: renderFromRight && -1,
        },
        y: [this.mult(0.49, args.armSX)],
        list: [
          // Upper Arm
          {
            list: [
              {
                z: upperZ,
                weight: args.armSX,
                points: [
                  {},
                  {
                    x: args[`upperArmX${nrName}`],
                    y: args[`upperArmY${nrName}`],
                  },
                ],
              },
            ],
          },

          // // Upper Sleeve
          // this.sleeves && !this.fullUpper && {
          // 	z: upperZ,
          // 	weight: args.armSX,
          // 	color: [255,0,0],
          // 	points: [
          // 		{ },
          // 		{ x: args[ "upperSleeveX"+nrName ], y: args[ "upperSleeveY"+nrName ] }
          // 	]
          // },

          // Lower Arm
          {
            x: args[`upperArmX${nrName}`],
            y: args[`upperArmY${nrName}`],
            z: 800,
            list: [
              {
                weight: args.armSX,
                points: [
                  {},
                  {
                    x: args[`lowerArmX${nrName}`],
                    y: args[`lowerArmY${nrName}`],
                  },
                ],
              },

              // Shirt
              this.shirt && {
                s: { add: [args.handSX] },
                minX: 2,
                x: [
                  args[`lowerArmX${nrName}`],
                  renderFromRight ? args.handHalfNegSX : { a: 0 },
                ],
                y: [args[`lowerArmY${nrName}`]],
                color: this.shirtColor.get(),
                list: [
                  {
                    fY: fullAngle < 90 && fullAngle > -90,
                    fX: fullAngle > 0,
                    x:
                      (fullAngle < 22.5 && fullAngle > -22.5) ||
                      fullAngle > 157.5 ||
                      fullAngle < -157.5
                        ? 0
                        : 1,
                    y:
                      (fullAngle > 67.5 && fullAngle < 112.5) ||
                      (fullAngle < -67.5 && fullAngle > -112.5)
                        ? 0
                        : 1,
                  },
                ],
              },

              // Hand
              {
                s: args.handSX,
                x: [args[`lowerArmX${nrName}`], args.handHalfNegSX],
                y: [args[`lowerArmY${nrName}`], args.handHalfNegSX],
                color: this.skinColor.get(),
                rX: fullAngle < 0,
                rotate:
                  (fullAngle > 45
                    ? fullAngle < 135
                      ? -90
                      : -180
                    : fullAngle < -45
                      ? fullAngle > -135
                        ? 90
                        : 180
                      : 0) * (renderFromRight ? -1 : 1),
                list: [
                  {},

                  // Finger
                  !tool &&
                    finger && {
                      sX: 1,
                      sY: {
                        r: 1.5,
                        a: 1,
                        max: {
                          r: 0.15,
                          useSize: args.personHalfSX,
                        },
                      },
                      fX: true,
                    },

                  // Tool
                  (!args.demo || args.tool) && tool && tool.draw(args, 100),

                  (rightSide || otherHand) &&
                    args.hatDown &&
                    !tool &&
                    this.headGear && {
                      rY: true,
                      list: [
                        this.headGear.draw(args, 100),
                        !sideView && {
                          tX: true,
                          rX: true,
                          x: 1,
                          list: [this.headGear.draw(args, 100)],
                        },
                      ],
                    },
                ],
              },
            ],
          },
        ],
      },
    ],
  };
}; // END Arm draw

// SHOULDER PAD --------------------------------------------------------------------------------
Builder.prototype.ShoulderPad = function (args) {
  // Form & Sizes
  this.X = this.R(-1, 0);
  this.Y = this.R(-1, 0.5);
  this.SX = this.R(0.1, 0.4);
  this.SY = this.R(1, 3);
  this.roundTop = this.IF(0.5);
  this.roundBottom = this.IF();
  this.roundInner = this.IF(0.3);
  this.border = this.IF(0.5);
  this.deko = this.IF(0.2);
  this.topDetail = this.IF(0.2);
  if (this.topDetail) {
    this.topDetailStrip = this.IF(0.2);
    this.topDetailX = !this.topDetailStrip && this.R(0, 1);
    this.topDetailSY = this.R(0, 1);
  }

  // Colors
  this.shoulderPadColor = this.IF()
    ? args.clothColor
    : this.IF()
      ? args.secondColor.copy({ brContrast: 1, max: 4 })
      : args.clothColor.copy({ brContrast: -1, max: 4 });

  this.shoulderPadDetailColor = this.IF()
    ? args.clothColor
    : this.IF()
      ? args.secondColor.copy({ brContrast: 2, max: 4 })
      : this.shoulderPadColor.copy({ brContrast: -1, max: 4 });

  if (this.deko || this.topDetail) {
    this.dekoColor = (
      this.IF(0.5) ? this.shoulderPadColor : args.secondColor
    ).copy({
      brContrast: 2,
      max: 4,
    });
    this.dekoShadowColor = this.dekoColor.copy({ brContrast: -1, max: 4 });
  }

  // Assets
}; // END ShoulderPad
Builder.prototype.ShoulderPad.prototype = new Builder.prototype.Object();
Builder.prototype.ShoulderPad.prototype.draw = function (args, z) {
  const { nr } = args;

  return {
    sX: {
      r: this.SX,
      useSize: args.personHalfSX,
      min: args.armSX,
      save: args.shoulderPadSX,
    },
    sY: {
      r: this.SY,
      useSize: args.armSX,
      min: { r: 0.2, useSize: args.shoulderPadSX },
    },
    y: { r: this.Y, useSize: args.armSX, max: { a: 0 } },
    x: { r: this.X, useSize: args.trapSX },
    id: `shoulderPad${nr}`,
    z,
    color: this.shoulderPadColor.get(),
    // rX: sideView && args.right,
    list: [
      this.roundInner && { name: "Dot", clear: true },
      this.roundTop && { name: "Dot", clear: true, fX: true },
      this.roundBottom && {
        name: "Dot",
        clear: true,
        fX: true,
        fY: true,
      },

      this.deko && {
        fY: true,
        tY: true,
        color: this.dekoColor.get(),
        sX: { r: 1, a: -1 },
        list: [
          {
            color: this.dekoShadowColor.get(),
          },
          {
            stripes: {
              gap: 1,
              random: 1,
            },
          },
        ],
      },

      // Main
      {},

      // Top Detail
      this.topDetail && {
        color: this.dekoColor.get(),
        tY: true,
        cX: this.topDetailStrip,
        fX: !this.topDetailStrip,
        sX: this.topDetailStrip
          ? { r: 1, a: -2 }
          : { r: 0.2, min: 1, save: args.shoulderPadDetailSX },
        sY: { r: this.topDetailSY },
        x: !this.topDetailStrip && {
          r: this.topDetailX,
          max: [args.shoulderPadSX, this.sub(args.shoulderPadDetailSX)],
        },
        y: 1,
        list: this.topDetailStrip
          ? [
              {
                stripes: {
                  gap: { r: 0.1, min: 1 },
                },
              },
            ]
          : [
              { name: "Dot", clear: true },
              { name: "Dot", fX: true, clear: true },
              {},
            ],
      },

      // Border
      this.border && {
        fY: true,
        sY: 1,
        color: this.shoulderPadDetailColor.get(),
      },
    ],
  };
}; // END ShoulderPad draw

// TOOL --------------------------------------------------------------------------------
Builder.prototype.Tool = function () {
  // Form & Sizes
  // Assets
}; // END Tool
Builder.prototype.Tool.prototype = new Builder.prototype.Object();
Builder.prototype.Tool.prototype.draw = function (args) {
  return {
    s: args.armSX,
    fY: true,
    // rX: sideView && args.right,
    list: [
      // { cX: true, sX: { r:1.5, useSize: args.personHalfSX }, color: [0,0,255], list: [
      // 	{},
      // 	{ color: [50,100,200], s:3, cY: true, fX: true }
      // ]}
    ],
  };
}; // END Tool draw

// SWORD --------------------------------------------------------------------------------
Builder.prototype.Sword = function (args, right) {
  // Form & Sizes
  this.rightSide = right;
  this.bladeSY = this.R(0, 1.5);
  this.bladeSX = this.IF(0.1) ? this.R(0, 0.4) : this.R(0, 0.2);
  this.handleSX = this.R(0, 0.5);
  this.handleOtherSX = this.handleSX / 2 + this.R(-0.25, 0.25);
  this.noKnife = this.IF(0.5);
  this.crossGuard = this.IF(1.5);
  this.notRound = this.IF();
  this.bend = !this.notRound && this.IF();
  this.middleStrip = this.IF(0.5);

  // Color
  this.hiltColor = (this.IF(0.5) ? args.firstColor : args.secondColor).copy({
    brContrast: -1,
  });
  this.bladeColor = (this.IF(0.5) ? args.firstColor : args.secondColor).copy({
    brContrast: 1,
    max: 4,
  });
  this.bladeLightColor = this.bladeColor.copy({ brContrast: 1 });
  this.bladeShadowColor = this.bladeColor.copy({ brContrast: -1 });

  // Assets
}; // END Sword

Builder.prototype.Sword.prototype = new Builder.prototype.Object();
Builder.prototype.Sword.prototype.draw = function (args, z) {
  const { nr } = args;
  const name = this.rightSide ? "right" : "left";
  const nrName = name + nr;

  args[`handleSY${nrName}`] = this.pushLinkList({
    add: [args.handSX, -2],
    min: 1,
  });
  args[`bladeSX${nrName}`] = this.pushLinkList({
    r: this.bladeSY,
    useSize: args.personHalfSX,
    min: { r: 3, useSize: args.armSX },
  });
  args[`bladeSY${nrName}`] = this.pushLinkList({
    r: this.bladeSX,
    useSize: args.personHalfSX,
    min: args[`handleSY${nrName}`],
  });
  args[`handleSX${nrName}`] = this.pushLinkList({
    r: this.handleSX,
    useSize: args.personHalfSX,
  });
  args[`handleOtherSX${nrName}`] = this.pushLinkList({
    r: this.handleOtherSX,
    useSize: args.personHalfSX,
    min: [args.handSX, 1],
  });

  return {
    sY: args[`handleSY${nrName}`],
    z,
    cY: true,
    color: this.hiltColor.get(),
    id: args[`tool${nrName}`],
    list: [
      {
        sX: args[`bladeSX${nrName}`],
        sY: args[`bladeSY${nrName}`],
        cY: this.noKnife,
        x: args[`handleSX${nrName}`],
        color: this.bladeColor.get(),
        list: [
          !this.notRound && {
            sX: 3,
            minX: 3,
            fX: true,
            list: [
              !this.bend && { sY: 1, clear: true },
              { sY: 1, clear: true, fY: true },
            ],
          },
          !this.notRound && {
            minX: 3,
            mY: 1,
            sX: 1,
            fX: true,
            list: [
              !this.bend && { sY: 1, clear: true },
              { sY: 1, clear: true, fY: true },
            ],
          },

          {},
          this.middleStrip && {
            sY: { r: 0.25, max: 2 },
            mX: 1,
            cY: this.noKnife,
            color: this.bladeLightColor.get(),
            list: [
              { sY: { r: 1, max: 1 }, fY: true },
              {
                sY: { r: 1, max: 1 },
                color: this.bladeShadowColor.get(),
              },
            ],
          },
        ],
      },

      {
        sX: args[`handleSX${nrName}`],
      },
      {
        sX: args[`handleOtherSX${nrName}`],
        fX: true,
      },

      // Cross Guard
      this.crossGuard && {
        x: args[`handleSX${nrName}`],
        sX: 1,
        sY: {
          r: this.noKnife ? 1.2 : 1,
          useSize: args[`bladeSY${nrName}`],
        },
        cY: this.noKnife,
      },
    ],
  };
}; // END Sword draw

// SHIELD --------------------------------------------------------------------------------
Builder.prototype.Shield = function (args, right) {
  // Form & Sizes
  this.name = right ? "right" : "left";
  this.shieldSX = this.IF() ? this.R(0.4, 0.8) : this.R(0, 0.4);
  this.shieldSY = this.IF() ? this.R(0.4, 0.8) : this.R(0, 0.4);

  if (this.IF()) {
    this.stripesGap = this.R(0.01, 0.2);
    this.stripesStrip = this.R(0.01, 0.2);
  }

  this.roundTop = this.IF(0.5);
  this.roundBottom = this.IF(0.5);

  // Colors
  this.shieldColor = (this.IF(0.5) ? args.firstColor : args.secondColor).copy({
    brContrast: this.IF() ? 1 : -1,
  });
  this.shieldShadowColor = this.shieldColor.copy({ brContrast: -1 });

  // Assets
  if (this.IF(1.1)) {
    this.logo = new this.basic.Logo(
      args,
      right,
      true,
      this.IF(0.1)
        ? this.shieldColor.copy({ nextColor: true, brContrast: 3 })
        : this.shieldShadowColor,
    );
  }
}; // END Shield

Builder.prototype.Shield.prototype = new Builder.prototype.Object();
Builder.prototype.Shield.prototype.draw = function (args, z) {
  const { nr } = args;
  const nrName = this.name + nr;
  const logo = [this.logo.draw(args, z + 805)];

  args[`shieldSX${nrName}`] = this.pushLinkList({
    r: this.shieldSX,
    useSize: args.personHalfSX,
    min: 1,
  });
  args[`shieldSY${nrName}`] = this.pushLinkList({
    r: this.shieldSY,
    useSize: args.personHalfSX,
    min: 1,
  });

  return {
    color: this.shieldColor.get(),
    z: z + 800,
    sX: args[`shieldSX${nrName}`],
    sY: args[`shieldSY${nrName}`],
    cX: true,
    cY: true,
    id: args[`shield${nrName}`],
    list: [
      (this.roundTop || this.roundBottom) && {
        minY: 3,
        clear: true,
        list: [
          this.roundTop && { name: "Dot" },
          this.roundTop && { name: "Dot", fX: true },

          this.roundBottom && { name: "Dot", fY: true },
          this.roundBottom && { name: "Dot", fY: true, fX: true },
        ],
      },

      {},
      this.stripesGap && {
        color: this.shieldShadowColor.get(),
        stripes: {
          gap: { r: this.stripesGap },
          strip: { r: this.stripesStrip },
        },
      },

      logo && {
        sX: { r: 0.5 },
        rX: true,
        list: logo,
      },
      logo && {
        sX: { r: 0.5 },
        fX: true,
        list: logo,
      },
    ],
  };
}; // END Shield draw
