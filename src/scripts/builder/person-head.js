import { Object } from "./object.js";

/* global Builder */

// HEAD --------------------------------------------------------------------------------
export const Head = function (args) {
  var hairNext = this.IF(0.7);

  // Form & Sizes
  this.headSY = this.IF(0.01) ? this.R(0, 0.4) : this.R(0.1, 0.15);
  if (args.demo && args.head) {
    this.headSY = args.head;
  }

  this.neckSY = this.R(0.05, 0.2);
  this.neckSX = this.R(0.4, 0.9);

  this.headSX = this.R(0.1, 0.7);
  this.headSideSYFak = this.R(1.6, 2.4);

  this.lowerHeadSX = (this.IF(0.5) && this.R(0.8, 1.2)) || 1;

  this.foreheadSY = this.R(0.1, 0.75);

  // Colors
  this.skinColor = args.skinColor;
  this.skinShadowColor = args.skinShadowColor;
  this.skinDetailColor = args.skinDetailColor;

  this.hairColor = args.hairColor =
    args.animal || this.IF(0.1)
      ? args.skinColor.copy({
          brContrast: (this.IF(0.5) ? 2 : 1) * (this.IF(0.5) ? -1 : 1),
        })
      : args.skinColor.copy({
          nextColor: hairNext,
          prevColor: !hairNext,
          brContrast: -2,
        });
  this.hairDetailColor = args.hairDetailColor = args.hairColor.copy({
    brContrast: -1,
  });

  this.hatColor = args.hatColor = (
    this.IF(0.5) ? args.firstColor : args.secondColor
  ).copy({
    brAdd: this.IF(0.5) ? 0 : this.IF(0.7) ? -2 : 1,
  });

  // Assets
  this.eye = new this.basic.Eye(args);
  this.mouth = new this.basic.Mouth(args);
  this.beard = this.IF() && new this.basic.Beard(args);
  this.headGear = args.headGear =
    (args.demo || this.IF(0.3)) &&
    new (this.IF(0.01)
      ? this.basic.Horns
      : this.IF(0.2)
        ? this.basic.Helm
        : this.IF(0.1)
          ? this.basic.HeadBand
          : this.basic.Hat)(args);

  this.hair = this.IF(0.9) && new this.basic.Hair(args);
}; // END Head
Head.prototype = new Object();
Head.prototype.getSizes = function (args) {
  var nr = args.nr,
    sideView = args.sideView;

  if (args.calc) {
    args.headBaseSY = this.pushLinkList({ r: 1, useSize: args.size });
    args.headMinSY = this.pushLinkList({
      r: this.headSY,
      useSize: args.headBaseSY,
      a: 1,
      min: 1,
    });
    args.headMinSX = this.pushLinkList({
      r: this.headSX,
      min: 1,
      useSize: args.headMinSY,
      a: 1.4,
    });

    args.neckSX = this.pushLinkList(
      sideView
        ? {
            add: [
              { r: -1 + this.neckSX, useSize: args.headMinSX },
              args.headMinSX,
            ],
            max: args.personSX,
            min: 1,
          }
        : {
            r: this.neckSX,
            useSize: args.headMinSX,
            max: args.personSX,
            min: 1,
          },
    );
    args.neckSY = this.pushLinkList({
      r: this.headSY * this.neckSY,
      useSize: args.size,
      a: -1,
      min: { a: 0 },
    });

    this.simpleAddHoverChange(0.3, 1.7, "head-size", args.headBaseSY);
  }

  this.mouthDrawn = this.mouth.draw(args, args.backView ? -500 : 50);
  this.eye.getSizes(args);

  if (args.calc) {
    args.faceMaxSY = this.pushLinkList({
      add: [args.mouthMaxSY, args.eyeSY, args.eyeFullMaxY],
    });
    args.foreheadSY = this.pushLinkList({
      r: this.foreheadSY,
      useSize: args.headMinSY,
    });
    args.upperHeadSY = this.pushLinkList({
      add: [args.foreheadSY, args.eyeSY, args.eyeY],
    });

    args.headSX = this.pushLinkList({
      add: [args.eyeSX, args.eyeX],
      min: {
        r: sideView ? this.headSideSYFak : 1,
        useSize: args.headMinSX,
        min: [args.mouthSX],
      },
    });

    args.headMaxSY = this.pushLinkList({
      add: [args.mouthTopMaxY, args.upperHeadSY],
    });
    args.headSY = this.pushLinkList({
      add: [args.mouthTopY, args.upperHeadSY],
      min: args.headMinSY,
    });

    args.hairSX = this.pushLinkList({
      add: [args.headSX, !this.hair ? { a: 0 } : sideView ? 2 : 1],
      max: { r: 1.2, useSize: args.headSX },
    });
    args.lowerHeadSY = this.pushLinkList({
      add: [args.headSY, this.sub(args.upperHeadSY), 1],
    });
    args.eyeOutX = this.pushLinkList({
      add: [args.headSX, this.sub(args.eyeSX), this.sub(args.eyeX)],
    });
    args.lowerHeadSX = this.pushLinkList({
      r: this.lowerHeadSX,
      useSize: args.headSX,
      min: args.mouthSX,
    });
  }
};
Head.prototype.draw = function (args) {
  var nr = args.nr,
    sideView = args.sideView,
    list;

  list = {
    y: args.fullBodySY,
    fY: true,
    color: this.skinColor.get(),
    z: 100,
    list: [
      {
        cX: sideView,
        list: [
          // Neck
          {
            sY: [args.neckSY, 2],
            y: -1,
            sX: args.neckSX,
            cX: sideView,
            fY: true,
          },

          // Head
          {
            sX: sideView ? args.headSX : args.lowerHeadSX,
            sY: args.headSY,
            fY: true,
            y: args.neckSY,
            cX: sideView,
            id: "head" + nr,
            list: [
              // Upper Head
              {
                sX: args.headSX,
                sY: [args.upperHeadSY, 1],
                id: "upperHead" + nr,
                list: [
                  // Horns
                  this.horns && this.horns.draw(args),

                  // Hair
                  this.hair && this.hair.draw(args),

                  // Head Gear
                  (!args.demo || args.hat) &&
                    !args.hatDown &&
                    this.headGear &&
                    this.headGear.draw(args),

                  {
                    minX: 4,
                    minY: 4,
                    list: [
                      {
                        name: "Dot",
                        clear: true,
                        fX: true,
                        fY: true,
                      },
                      {
                        name: "Dot",
                        clear: true,
                        fX: true,
                      },
                      sideView && {
                        name: "Dot",
                        clear: true,
                      },
                    ],
                  },

                  {},
                ],
              },

              // Round Bottom
              {
                fY: true,
                sY: args.lowerHeadSY,
                minY: 4,
                minX: 3,
                list: [
                  {
                    name: "Dot",
                    fY: true,
                    clear: true,
                    fX: true,
                  },
                  sideView && {
                    name: "Dot",
                    fY: true,
                    clear: true,
                  },
                ],
              },

              // Lower Head
              {
                sY: args.lowerHeadSY,
                fY: true,
                list: [
                  { name: "Dot", clear: true, fX: true },
                  {},

                  // Beard
                  this.beard && this.beard.draw(args),
                ],
              },

              // Face
              // Mouth
              this.mouthDrawn ||
                this.mouth.draw(args, args.backView ? -500 : 50),

              // Eye Area
              this.eye.draw(args, args.backView ? -500 : 50),
            ],
          },
        ],
      },
    ],
  };

  return list;
};

// EYE --------------------------------------------------------------------------------
export const Eye = function (args) {
  // Form & Sizes
  this.eyeBrow = this.IF(0.7);
  this.monoBrow = this.eyeBrow && this.IF(0.05);

  this.eyeLidsBottom = this.IF(0.7);
  this.eyeLidsTop = this.IF(this.eyeBrow ? 0.3 : 0.7);
  this.eyeLids = this.eyeLidsBottom || this.eyeLidsTop;

  this.eyeRoundTop = this.IF(0.5);
  this.eyeRoundBottom = this.IF(0.5);

  this.eyeSX = this.R(0.2, 0.4);
  this.eyeSY = this.R(0.2, 3);

  this.eyeX = this.R(0.1, 0.7) - this.eyeSX;
  this.eyeY = this.R(-0.2, 0.3);

  this.highPupil = this.IF(0.1);

  this.glasses = this.IF(0.02);

  // Colors
  this.skinColor = args.skinColor;
  this.skinShadowColor = args.skinShadowColor;
  this.skinDetailColor = args.skinDetailColor;
  this.hairColor = args.hairColor;

  this.eyeColor = args.skinColor.copy({ brAdd: this.glasses ? 2 : 1 });
  this.pupilColor = this.glasses
    ? this.eyeColor.copy({ brAdd: -2 })
    : args.skinDetailColor;

  this.glassesColor = args.skinColor.copy({
    nextColor: this.IF(0.5),
    brAdd: -2,
  });

  // Assets
}; // END Eye
Eye.prototype = new Object();
Eye.prototype.getSizes = function (args) {
  var nr = args.nr,
    sideView = args.sideView;

  if (args.calc) {
    args.eyeFullSX = this.pushLinkList({
      r: this.eyeSX,
      useSize: args.headMinSX,
      max: args.headMinSX,
    });
    args.eyeSX = this.pushLinkList({
      r: sideView ? 0.8 : 1,
      useSize: args.eyeFullSX,
      min: { r: 0.3, useSize: args.headMinSX, max: 1 },
    });
    args.eyeSY = this.pushLinkList({
      r: this.eyeSX * this.eyeSY,
      useSize: args.headMinSX,
      min: { r: 0.2, useSize: args.headMinSY, max: 1 },
      max: { r: 2, useSize: args.eyeSX, a: -1 },
    });

    args.eyeX = this.pushLinkList({
      r: this.eyeX,
      useSize: args.headMinSX,
      min: 1,
    });
    args.eyeY = this.pushLinkList({
      r: this.eyeY,
      useSize: args.headMinSY,
      min: { a: 0 },
    });
    args.eyeFullY = this.pushLinkList([args.eyeY, args.mouthTopY, 0.1]);
    args.eyeFullMaxY = this.pushLinkList([args.eyeY, args.mouthTopMaxY, 0.1]);

    args.eyeBrowSY = this.pushLinkList({ r: 0.3, useSize: args.eyeSY });
  }
};
Eye.prototype.draw = function (args) {
  var nr = args.nr,
    sideView = args.sideView,
    thisEye = args.eye || {},
    lids = thisEye.lids,
    lookHor = thisEye.lookHor,
    lookVert = thisEye.lookVert,
    brow = thisEye.brow,
    eyeSad = lids === "sad",
    eyeAngry = eyeSad || lids === "angry",
    eyeClosed =
      eyeAngry ||
      lids === "closed" ||
      lids === "sleepy" ||
      (args.right && lids === "wink"),
    eyeHalfClosed = !eyeClosed && lids === "halfClosed",
    lookUp = lookHor === "up",
    lookDown = lookHor === "down" || lookHor === "veryDown",
    lookExtrem = lookUp || lookHor === "veryDown",
    lookForward = !lookUp && !lookDown,
    lookSide = lookVert,
    lookRight = lookVert === "right",
    eyeBrowRaised = brow === "raised" || (args.right && brow === "sceptical"),
    eyeBrowLow = brow === "low" || (!args.right && brow === "sceptical"),
    eyeBrowSad = brow === "sad" || (args.right && brow === "superSceptical"),
    eyeBrowAngry =
      eyeBrowSad ||
      brow === "angry" ||
      (!args.right && brow === "superSceptical");

  return (
    !args.backView && {
      sX: args.eyeSX,
      sY: args.eyeSY,
      x: args.eyeX,
      y: args.eyeFullY,
      fY: true,
      id: "eyes" + nr,
      color: (this.glasses ? this.pupilColor : this.skinShadowColor).get(),
      z: 0,
      list: [
        this.glasses && {
          color: this.glassesColor.get(),
          list: [
            // Rim
            { m: -1 },

            //Between Eyes
            { sY: 1, sX: args.eyeX, tX: true },

            // Ear Things
            { sY: 1, sX: args.eyeOutX, fX: true, tX: true },

            // Glasses
            { color: this.eyeColor.get() },
          ],
        },

        !eyeClosed
          ? {
              // Open Eyes
              list: [
                {
                  minY: 3,
                  minX: 3,
                  list: [
                    {
                      minX: 4,
                      list: [
                        !this.eyeLidsTop && {
                          name: "Dot",
                          clear: true,
                        },
                        !this.eyeLidsBottom && {
                          name: "Dot",
                          fY: true,
                          clear: true,
                        },
                      ],
                    },

                    !this.eyeLidsBottom && {
                      name: "Dot",
                      fY: true,
                      fX: true,
                      clear: true,
                    },
                    !this.eyeLidsTop && {
                      name: "Dot",
                      fX: true,
                      clear: true,
                    },
                  ],
                },

                {
                  sY: !this.glasses && eyeHalfClosed && 1,
                  y: !this.glasses && eyeHalfClosed && [args.lowerLids],
                  fY: true,
                  list: [
                    { color: this.eyeColor.get() },

                    {
                      sX: {
                        r: 0.4,
                        max: [args.eyeSX, -1],
                        min: 1,
                      },
                      sY: !this.highPupil && {
                        r: lookExtrem ? 0.5 : 0.6,
                        max: args.eyeSY,
                        min: 1,
                      },
                      color: this.pupilColor.get(),
                      fY: !lookUp,
                      rY: lookUp,
                      rX: lookSide && args.right == lookRight,
                      fX: lookSide && args.right == lookRight,
                      cY: lookForward,
                      id: "pupil" + nr,
                      list: !this.highPupil && [
                        {
                          minX: 3,
                          minY: 3,
                          list: [
                            {
                              name: "Dot",
                              clear: true,
                              fX: true,
                            },
                          ],
                        },
                        {
                          minX: 4,
                          minY: 4,
                          list: [
                            {
                              name: "Dot",
                              clear: true,
                            },
                            lookForward && {
                              name: "Dot",
                              clear: true,
                              fX: true,
                              fY: true,
                            },
                            lookForward && {
                              name: "Dot",
                              clear: true,
                              fY: true,
                            },
                          ],
                        },
                        {},
                      ],
                    },
                  ],
                },

                // Half Closed
                !this.glasses &&
                  eyeHalfClosed && {
                    id: "halfClosed" + nr,
                    list: [
                      {
                        sY: {
                          r: 1,
                          add: [this.sub(args.lowerLids), -1],
                        },
                      },
                      {
                        sY: {
                          r: 0.5,
                          max: { r: 1, a: -2 },
                          save: "lowerLids" + nr,
                        },
                        fY: true,
                      },
                    ],
                  },

                // EyeLids Top
                !this.glasses &&
                  this.eyeLidsTop && {
                    minY: 3,
                    list: [
                      {
                        sY: { r: 1, a: -2, max: 1 },
                      },
                    ],
                  },

                // EyeLids Bottom
                !this.glasses &&
                  this.eyeLidsBottom && {
                    minY: 4,
                    list: [
                      {
                        sY: { r: 1, a: -2, max: 1 },
                        fY: true,
                      },
                    ],
                  },
              ],
            }
          : {
              // Closed Eyes
              fY: true,
              sY: 1,
              cY: lids !== "sleepy",
            },

        // Eye Brow
        this.eyeBrow && {
          sX: this.monoBrow
            ? [args.eyeSX, args.eyeX]
            : {
                r: 1,
                a: 1,
                max: [args.headSX, this.sub(args.eyeX)],
              },
          sY: eyeBrowAngry
            ? [args.eyeBrowSY, { r: 0.2, useSize: args.eyeSY, max: 1 }]
            : args.eyeBrowSY,
          y:
            (eyeBrowRaised && -1) ||
            (eyeBrowLow && { r: 0.2, useSize: args.eyeSX, max: 1 }),
          minX: 2,
          fX: this.monoBrow,
          tY: true,
          id: "eyeBrow" + nr,
          color: this.hairColor.get(),
          list: eyeBrowAngry && [
            {
              sX: { r: 0.5 },
              sY: args.eyeBrowSY,
              fY: eyeBrowSad,
              fX: true,
            },
            { sX: { r: 0.5 }, sY: args.eyeBrowSY, fY: !eyeBrowSad },

            // { a: eyeBrowSad ? -1: 1, max: { r: 0.2} }
          ],
        },
      ],
    }
  );
}; // END Eye draw

// MOUTH --------------------------------------------------------------------------------
export const Mouth = function (args) {
  // Form & Sizes
  this.mouthSX = this.R(0.4, 0.6);
  this.mouthSY = this.R(0.2, 0.4);
  this.mouthY = this.R(0.1, 0.6);

  // Colors
  this.skinColor = args.skinColor;
  this.skinDetailColor = args.skinDetailColor;
  this.teethColor = this.skinColor.copy({ brAdd: 2 });
  this.teethShadowColor = this.teethColor.copy({ brAdd: -1 });

  // Assets
}; // END Mouth
Mouth.prototype = new Object();
Mouth.prototype.draw = function (args) {
  var nr = args.nr,
    sideView = args.sideView,
    thisMouth = args.mouth || {},
    mouthWidth = thisMouth.width,
    mouthHeight = thisMouth.height,
    mouthForm = thisMouth.form,
    teeth = thisMouth.teeth,
    mouthD = mouthForm === "D: ",
    mouthGrin = mouthD || mouthForm === "grin",
    mouthNarrow = mouthWidth === "narrow",
    mouthSlight = mouthHeight === "slight",
    mouthHalfOpen = mouthHeight === "half",
    mouthOpen = mouthSlight || mouthHalfOpen || mouthHeight === "full",
    mouthSmile = mouthGrin && !mouthOpen,
    teethFull = !mouthSlight && mouthOpen && !mouthNarrow && teeth === "full",
    teethTop =
      !mouthSlight && ((mouthOpen && teeth === "top") || teeth === "both"),
    teethBottom =
      !mouthSlight && ((mouthOpen && teeth === "bottom") || teeth === "both"),
    smirk = thisMouth.smirk;

  if (args.calc) {
    args.mouthSX = this.pushLinkList({
      r: this.mouthSX * (sideView ? 0.7 : 1),
      a: 0.5,
      useSize: args.headMinSX,
      max: args.headMinSX,
    });
    args.mouthMaxSY = this.pushLinkList({
      r: this.mouthSY,
      useSize: args.headMinSY,
    });
    args.mouthSY = this.pushLinkList(
      mouthSlight || mouthSmile
        ? { a: 2, max: args.mouthMaxSY }
        : mouthOpen
          ? mouthHalfOpen
            ? this.mult(0.5, args.mouthMaxSY)
            : args.mouthMaxSY
          : { a: 1, max: args.mouthMaxSY },
    );
    args.mouthY = this.pushLinkList({
      r: this.mouthY,
      useSize: args.headMinSY,
    });
    args.mouthTopMaxY = this.pushLinkList({
      add: [args.mouthMaxSY, args.mouthY],
    });
    args.mouthTopY = this.pushLinkList({
      add: [args.mouthSY, args.mouthY],
    });
  }

  return (
    !args.backView && {
      sX: {
        r: (mouthNarrow ? 0.4 : 1) * (smirk && args.right ? 0.4 : 1),
        useSize: args.mouthSX,
      },
      minX: 2,
      sY: args.mouthSY,
      y: args.mouthY,
      fY: true,
      id: "mouth" + nr,
      z: 0,
      color: this.skinDetailColor.get(),
      list: mouthSmile
        ? [
            { sX: 1, sY: 1, fX: true, fY: mouthD },
            { sX: { r: 1, a: -1 }, sY: 1, fY: !mouthD },
          ]
        : mouthOpen && [
            mouthOpen &&
              (mouthD || mouthGrin) && {
                name: "Dot",
                clear: true,
                fX: true,
                fY: mouthD,
              },

            {},

            teethFull && {
              sX: { r: 0.75, min: { r: 1, a: -2, min: 2 } },
              color: this.teethColor.get(),
              list: [
                {},
                {
                  sY: { r: 0.2, max: 1 },
                  cY: true,
                  color: this.teethShadowColor.get(),
                },
              ],
            },

            teethTop && { sY: 1, color: this.teethColor.get() },

            teethBottom && {
              sY: 1,
              fY: true,
              color: this.teethColor.get(),
            },
          ],
    }
  );
}; // END Mouth draw

// HAIR --------------------------------------------------------------------------------
export const Hair = function (args) {
  // Form & Sizes
  this.curly = args.headGear && this.IF();

  this.longHair = this.IF(0.1);
  this.hairSY = this.R(0.1, 1) * (this.longHair ? 3 : 1);
  this.hairSide = this.curly || this.IF(0.99);
  this.hairSideSY = 0.8 || (this.hairSide && this.R(0.2, 0.8));
  this.hairAccuracy = this.R(0.1, 0.3);
  this.hairS = this.R(0.01, 0.1);

  this.detailSY = this.R(0, 0.25);
  this.detailChance = this.R(0, 0.5);

  // Colors
  this.hairColor = args.hairColor;
  this.hairDetailColor = args.hairDetailColor;

  // Assets
}; // END Hair
Hair.prototype = new Object();
Hair.prototype.draw = function (args) {
  var nr = args.nr,
    sideView = args.sideView,
    backView = args.backView,
    rightSide = sideView || !args.right,
    name = args.id + "_" + args.right + nr;

  if (args.calc) {
    args.hairS = this.pushLinkList({
      r: this.hairS,
      useSize: args.headMinSY,
      min: 1,
    });
    args.hairAccuracy = this.pushLinkList({
      r: this.hairAccuracy * -1,
      useSize: args.headMinSY,
      max: { a: 0 },
    });
    args.hairDetailSY = this.pushLinkList({
      r: this.detailSY,
      useSize: args.headMinSY,
      min: 1,
    });
  }

  return {
    color: this.hairColor.get(),
    sX: args.hairSX,
    cX: sideView,
    fX: sideView,
    z: 100,
    id: "hair" + nr,
    list: [
      // Main Hair Front
      {
        use: "hairFront" + name,
        cut: true,
      },

      // Main Hair Back
      {
        use: "hairBack" + name,
        z: -1000,
        cut: true,
      },

      // Detail
      {
        minY: 6,
        list: [
          // Back
          {
            use: "hairBack" + name,
            z: -1000,
            color: this.hairDetailColor.get(),
            chance: this.detailChance,
            sY: { a: args.hairDetailSY, random: args.hairDetailSY },
            mask: true,
          },
          // Front
          {
            use: "hairFront" + name,
            color: this.hairDetailColor.get(),
            chance: this.detailChance,
            sY: { a: args.hairDetailSY, random: args.hairDetailSY },
            mask: true,
          },
        ],
      },

      // Top
      {
        save: "hairFront" + name,
        sX: args.headSX,
        cX: sideView,
        sY: 1,
      },

      {
        sY: { r: 1, a: -1 },
        y: 1,
        list: [
          // ForeHead
          rightSide && {
            sX: !sideView && { r: 2, useSize: args.hairSX, a: -1 },
            sY: { r: 0.5, useSize: args.foreheadSY, a: -1 },
            fX: true,
            save: "hairFront" + name,
            list: [
              {
                stripes: {
                  random: args.hairAccuracy,
                  seed: args.id + (args.right ? 1 : 0),
                  strip: args.hairS,
                },
              },
            ],
          },

          // Back Hair
          this.hairSide && {
            color: this.longHair ? [0, 100, 150] : [0, 130, 255],
            fX: true,
            sX: sideView ? { r: 0.5 } : { r: 2, useSize: args.hairSX, a: -1 },
            sY: {
              r: this.hairSY,
              useSize: args.headMinSY,
              min: args.hairSideSY,
              max: [args.personRealMinSY, -2],
            },
            list: [
              {
                save: (backView ? "hairFront" : "hairBack") + name,
                color: [255, 0, 0],
                stripes: {
                  random: args.hairAccuracy,
                  seed: args.id + (args.right ? 1 : 0),
                  strip: args.hairS,
                },
              },
            ],
          },

          // Side Hair
          this.hairSide && {
            sX: {
              r: sideView ? 0.8 : 0.6,
              useSize: args.eyeOutX,
              max: {
                r: sideView ? 0.9 : 0.15,
                useSize: args.headSX,
              },
            },
            sY: {
              r: this.hairSideSY,
              useSize: args.upperHeadSY,
              save: "hairSideSY" + nr,
            },
            x: 1,
            fX: true,
            save: "hairFront" + name,
            // color: [0,0,255],
            stripes: {
              random: sideView && args.hairAccuracy,
              strip: sideView && args.hairS,
              change: !sideView && { r: -0.3 },
              seed: args.id + (args.right ? 1 : 0),
            },
          },
        ],
      },
    ],
  };
}; // END Hair draw

// BEARD --------------------------------------------------------------------------------
export const Beard = function (args) {
  // Form & Sizes
  this.threeOClockShadow = this.IF(0.1);
  this.mainBeard = this.IF(0.5);
  this.mustach = !this.mainBeard || this.IF(0.8);
  this.goate = this.mustach && this.IF(this.mainBeard ? 0.8 : 0.05);
  this.mustachGap = this.mustach && this.IF(0.5);
  this.beardColor = args.hairColor;
  this.chinBard = this.IF(0.05);
  this.beardLength = this.R(0.2, 1.5);

  this.detailSY = this.R(0, 0.25);
  this.detailChance = this.R(0, 0.5);

  // Color
  if (this.threeOClockShadow) {
    this.skinShadowColor = args.skinShadowColor.copy({ min: 1 });
  }
  this.hairDetailColor = args.hairDetailColor;

  // Assets
}; // END Beard
Beard.prototype = new Object();
Beard.prototype.draw = function (args) {
  var nr = args.nr,
    sideView = args.sideView;

  if (args.calc) {
    args.beardDetailSY = this.pushLinkList({
      r: this.detailSY,
      useSize: args.headMinSY,
      min: 1,
    });
  }

  return {
    color: this.beardColor.get(),
    id: "beard" + nr,
    z: args.backView && -100,
    list: [
      // 3 O’Clock Shadow
      this.threeOClockShadow && {
        id: "head" + nr,
        sY: args.mouthTopY,
        fY: true,
        color: this.skinShadowColor.get(),
      },

      // Beard Detail
      this.mainBeard && { use: "beard" + nr },

      this.mainBeard && {
        use: "beard" + nr,
        color: this.hairDetailColor.get(),
        chance: this.detailChance,
        sY: { a: args.beardDetailSY, random: args.beardDetailSY },
        mask: true,
      },

      // Mustach
      this.mustach && {
        sY: { r: 0.6, useSize: args.eyeY },
        sX: [args.mouthSX, 1],
        fY: true,
        y: args.mouthTopY,
        x: this.mustachGap && 1,
        stripes: { horizontal: true, change: -1 },
      },

      // Goate
      this.goate && {
        sX: { r: 0.2 },
        sY: args.mouthTopY,
        fY: true,
        x: [
          args.mouthSX,
          this.mustachGap ? { r: 0.1, useSize: args.headSX, max: 1 } : { a: 0 },
        ],
      },

      // Main Beard
      this.mainBeard && {
        fY: true,
        tY: true,
        id: "beard" + nr,
        y: [args.mouthY, -1],
        sY: { r: this.beardLength, useSize: args.headMaxSY },
        sX: { r: (sideView ? 0.5 : 1) * (this.chinBard ? 0.5 : 1) },
        list: [
          {
            y: -1,
            sY: 2,
          },

          {
            stripes: {
              change: { r: -0.5 },
              random: { r: -0.3, a: 2, max: { a: 0 } },
              seed: args.id + (args.right ? 1 : 0) * 2,
            },
            save: "beard" + nr,
          },
        ],
      },
    ],
  };
}; // END Beard draw

// HAT --------------------------------------------------------------------------------
export const Hat = function (args) {
  // Form & Sizes
  this.hatSY = this.R(0, 1);

  this.smallHat = this.IF(0.05) && this.R(0.3, 1);

  this.getSmaller = this.IF();
  this.hatTopSX = this.getSmaller && this.R(-0.6, 1);

  this.roundHat = !this.getSmaller && this.IF(0.5);
  this.hatRim = this.IF(0.6);
  this.baseCap = this.hatRim && this.IF(0.1);
  this.thickRim = this.hatRim && this.IF(0.3);
  this.hatBand = this.IF(
    0.3 + (this.hatRim ? 0.3 : 0) + (this.baseCap ? -0.4 : 0),
  );

  this.dent = this.IF(
    0.2 + (this.hatRim ? 0.3 : 0) + (this.baseCap ? -0.49 : 0),
  );
  this.dentSX = this.dent && this.R(0, 0.5);

  this.hatDepthY = this.R(0.1, 1) * (this.smallHat || 1);
  this.hatRimSY = this.hatRim && this.R(1, 2);

  // Colors
  this.hatColor = args.hatColor;
  this.hatBandColor =
    this.hatBand &&
    !this.baseCap &&
    (this.IF(0.5) ? args.firstColor : args.secondColor).copy({
      brContrast: -1,
    });
  this.hatRimColor = this.IF(this.baseCap ? 0.8 : 0.1)
    ? this.hatColor.copy({ nextColor: true, brContrast: -2 })
    : this.hatColor;

  // Assets
}; // END Hat
Hat.prototype = new Object();
Hat.prototype.draw = function (args) {
  var nr = args.nr,
    sideView = args.sideView;

  // if( args.calc ) {
  // 	args.hatDepthY = this.pushLinkList( );
  // }

  return {
    color: this.hatColor.get(),
    tY: true,
    id: "hat" + nr,
    z: 500,
    cX: sideView,
    fX: sideView,
    sY: {
      r: this.hatSY,
      useSize: args.headMinSY,
      min: [
        {
          r: this.hatDepthY,
          useSize: args.foreheadSY,
          min: 1,
          save: "hatDepthY" + nr,
        },
        1,
      ],
    },
    sX: this.smallHat
      ? { r: this.smallHat, useSize: args.hairSX }
      : args.hairSX,
    y: !this.smallHat && args.hatDepthY,
    list: [
      // Dent
      !sideView &&
        this.dent && {
          sX: { r: this.dentSX * (this.hatTopSX || 1), min: 1 },
          clear: true,
          sY: 1,
        },

      // Rounding
      this.roundHat && { name: "Dot", clear: true, fX: true },
      this.roundHat && sideView && { name: "Dot", clear: true },

      // Hat Band
      this.hatBand &&
        (sideView || !this.baseCap) && {
          z: 10,
          sY: { r: 0.3, min: 2 },
          sX: this.baseCap && { r: 0.2 },
          fX: true,
          fY: true,
          clear: this.baseCap,
          color: this.hatBandColor && this.hatBandColor.get(),
        },

      this.getSmaller && { id: "hair" + nr, clear: true },

      // Main Hat
      {
        points: this.getSmaller && [
          sideView
            ? { y: this.hatTopSX > 0 && args.hatDepthY, fY: true }
            : { y: -1 },
          sideView
            ? {
                x: { r: this.hatTopSX * (sideView ? 0.5 : 1) },
                y: -1,
              }
            : { y: -1 },
          {
            x: { r: this.hatTopSX * (sideView ? 0.5 : 1) },
            fX: true,
            y: -1,
          },
          {
            y: this.hatTopSX > 0 && args.hatDepthY,
            fY: true,
            fX: true,
          },
          { fY: true, fX: true },
          { fY: true },
        ],
      },

      // Rim
      this.hatRim && {
        id: "hatRim" + nr,
        z: 20,
        sY: { a: this.thickRim ? 2 : 1, save: "hatRim" + nr },
        sX:
          (!this.baseCap && { r: this.hatRimSY }) ||
          (sideView && { r: (this.hatRimSY - 1) / 2 + 1 }),
        cX: sideView && !this.baseCap,
        fX: sideView,
        fY: true,
        color: this.hatRimColor.get(),
      },
    ],
  };
}; // END Hat draw

// HELM --------------------------------------------------------------------------------
export const Helm = function (args) {
  // Form & Sizes
  this.helmSY = this.IF(0.5) ? 1 : this.R(0.1, 1.5);
  this.nosePiece = this.IF(0.5);
  this.topDetail = this.IF(0.3);
  this.foreheadDetail = this.IF(0.3);
  this.bottomDetail = this.IF(0.3);
  this.sides = this.IF(0.8);
  this.full = this.sides && this.IF(0.1);

  this.foreheadDetailGap = this.GR(0, 3);
  this.foreheadDetailSX = this.GR(0, 3);
  this.foreheadDetailSY = this.R(0.1, 0.5);

  // Colors
  this.helmColor = (this.IF(0.5) ? args.firstColor : args.secondColor).copy({
    brContrast: this.IF(0.8) ? -2 : 0,
  });
  this.helmDetailColor = this.helmColor.copy({ brContrast: -1 });

  // Assets
  this.horns = this.IF(0.1) && new this.basic.Horns(args);
}; // END Helm
Helm.prototype = new Object();
Helm.prototype.draw = function (args) {
  var nr = args.nr,
    sideView = args.sideView;

  // if( args.calc ) {
  // 	args.hatDepthY = this.pushLinkList( );
  // }

  return {
    color: this.helmColor.get(),
    id: "hat" + nr,
    z: 160,
    y: -1,
    cX: sideView,
    sY: [{ r: this.helmSY, useSize: args.headMaxSY }, 2],
    sX: args.hairSX,
    list: [
      {
        list: [
          !sideView &&
            this.sides && {
              color: !args.backView && this.helmDetailColor.get(),
              z: -1000,
            },

          // Horns
          this.horns && this.horns.draw(args),

          // Top Detail
          this.topDetail && {
            tY: true,
            sX: { r: 0.2, min: 1 },
            sY: 1,
            cX: sideView,
            color: this.helmDetailColor.get(),
          },

          // Top Part
          { sY: { r: 1, max: args.foreheadSY } },

          // Sides
          this.sides && {
            sX: { a: args.eyeOutX, min: 1 },
            fX: true,
            list: this.bottomDetail && [
              {},
              {
                fY: true,
                y: 1,
                sY: 2,
                color: this.helmDetailColor.get(),
              },
            ],
          },

          // Full
          this.full && {
            y: [args.foreheadSY, args.eyeSY, 1],
            sY: args.mouthTopMaxY,
          },

          // Nose Piece
          this.nosePiece && {
            z: 5,
            sX: {
              r: 0.2,
              useSize: args.headSX,
              max: args.eyeX,
              min: [args.eyeX, -1],
            },
            sY: [args.foreheadSY, args.eyeSY, 2],
          },

          args.backView && {},
        ],
      },

      this.foreheadDetail && {
        sY: {
          r: this.foreheadDetailSY,
          useSize: args.foreheadSY,
          min: 1,
          save: "helmDetailSX" + nr,
        },
        y: {
          r: 0.7,
          a: -1,
          useSize: args.foreheadSY,
          min: { a: 0 },
          max: {
            r: -1.2,
            useSize: args.helmDetailSX,
            a: args.foreheadSY,
          },
        },
        color: this.helmDetailColor.get(),
        stripes: {
          gap: this.foreheadDetailGap,
          strip: this.foreheadDetailSX,
        },
      },
    ],
  };
}; // END Helm draw

// HEADBAND --------------------------------------------------------------------------------
export const HeadBand = function (args) {
  // Form & Sizes

  // Colors
  this.headBandColor = args.hatColor;

  // Assets
}; // END HeadBand
HeadBand.prototype = new Object();
HeadBand.prototype.draw = function (args, z) {
  var nr = args.nr,
    sideView = args.sideView;

  return {
    z: z,
    sY: {
      r: 0.3,
      useSize: args.foreheadSY,
      min: 1,
      save: "headBandSX" + nr,
    },
    sX: args.hairSX,
    cX: sideView,
    color: this.headBandColor.get(),
    y: {
      r: 0.5,
      useSize: args.foreheadSY,
      max: [args.foreheadSY, this.sub(args.headBandSX)],
    },
  };
}; // END HeadBand draw

// HORNS --------------------------------------------------------------------------------
export const Horns = function (args) {
  // Form & Sizes
  this.hornsSX = this.R(0.05, 2);
  this.hornsSY = this.R(0.05, 0.3);
  this.hornsY = this.R(0.1, 0.25);

  this.hornsBendSY = this.R(0.1, 1);

  // Colors
  this.hornColor = this.IF() ? args.skinColor : args.hairColor;

  // Assets
}; // END Horns
Horns.prototype = new Object();
Horns.prototype.draw = function (args, z) {
  var nr = args.nr,
    sideView = args.sideView;

  // if( args.calc ) {
  // 	args.hatDepthY = this.pushLinkList( );
  // }

  return {
    tX: !sideView || !this.ears,
    fX: true,
    z: z + (sideView ? 100 : 0),
    id: "horns" + nr,
    color: this.hornColor.get(),
    sX: {
      r: this.hornsSX * (sideView ? 0.5 : 1),
      useSize: args.headSX,
      min: 1,
    },
    sY: { r: this.hornsSY, useSize: args.headMaxSY },
    x: sideView && {
      r: this.ears ? 0.3 : this.hornsSX * 0.3,
      useSize: args.headSX,
    },
    y: { r: this.hornsY, useSize: args.headMaxSY },
    list: [
      { name: "Dot", clear: true, fX: true, fY: true },
      // bend
      {
        tY: true,
        fX: true,
        sX: { r: 1, a: -1, otherDim: true, min: 1 },
        sY: { r: this.hornsBendSY, otherDim: true },
        list: [{ name: "Dot", clear: true, fX: true }, {}],
      },

      // Main Horn
      {},
    ],
  };
}; // END Horns draw
