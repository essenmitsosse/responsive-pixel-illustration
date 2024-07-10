'use strict'

import {
  getSmallerDim,
  getBiggerDim,
  mult,
  sub,
  getDarken,
} from '../helperPixelGraphics'
import { ColorRgb, ImageFunction, RenderObject } from '../PixelGraphics/types'
const shadowColor = [255, 255, 255],
  shadow = getDarken(shadowColor, 0.5),
  detail = getDarken(shadowColor, 0.2),
  backgroundColor: ColorRgb = [60, 60, 60],
  water: ColorRgb = [36, 44, 53],
  skin: ColorRgb = [227, 200, 190],
  skinDetail = detail(skin),
  skinShadow = shadow(skin),
  leftHalf: ReadonlyArray<RenderObject> = [
    {
      sY: { r: 1, add: [sub('headHeight'), sub('legs'), -1] },
      y: ['legs'],
      sX: { r: 0.6, min: 2, max: { r: 1, a: -1 }, save: 'torsoWidth' },
      fY: true,
      list: [
        // Torso
        {},

        // Arm
        {
          tX: true,
          fX: true,
          sX: {
            r: 0.5,
            max: { r: 0.4, otherDim: true },
            min: 1,
            save: 'armWidth',
          },
          sY: {
            r: 1.5,
            add: [{ otherDim: true, r: -0.5 }],
            min: { r: 0.8 },
          },
          list: [
            {},
            {
              color: skin,
              fY: true,
              tY: true,
              sY: { r: 1, otherDim: true },
            },
          ],
        },
      ],
    },

    // Legs
    {
      sY: {
        r: 0.8,
        add: [{ r: -2, otherDim: true }],
        min: { r: 0.4 },
        save: 'legs',
      },
      color: water,
      fY: true,
      sX: { r: 0.6, min: 2 },
      list: [
        { sY: { r: 0.1, min: 1 } },
        {
          fX: true,
          sX: { r: 0.5 },
          list: [
            {
              sY: { r: 0.2 },
              sX: { r: 1, a: -2, min: 1 },
              cX: true,
              color: [255, 255, 255],
              fY: true,
            },
            {
              sY: {
                r: 0.8,
                add: [{ r: 0.5, otherDim: true }],
                max: { r: 1 },
              },
            },
            {
              fY: true,
              color: [100, 50, 40],
              sY: { r: 0.05, min: 1 },
            },
          ],
        },
      ],
    },

    // Head
    {
      sY: {
        add: [{ r: 2, otherDim: true }, { r: -0.1 }],
        max: { r: 0.4 },
        min: { r: 0.05, min: 3 },
        save: 'headHeight',
      },
      sX: { r: 0.5, min: 2 },
      color: skin,
      list: [
        {},

        // Ears
        {
          tX: true,
          fX: true,
          y: { r: 0.5 },
          sY: { r: 0.1 },
          sX: { r: 0.06, otherDim: true },
        },

        // Hair
        {
          gap: { a: 0 },
          random: { r: 0.2 },
          color: skinShadow,
          sY: { r: 0.1, min: 1 },
        },
        {
          gap: { a: 0 },
          random: { r: 0.4 },
          color: skinShadow,
          sX: { r: 0.15 },
          sY: { r: 0.3 },
          fX: true,
        },

        // Eye
        {
          color: skinDetail,
          x: { r: 0.1, min: 1 },
          y: { r: 0.5 },
          sX: 'eyeSize',
          sY: 'eyeSize',
        },

        // Mouth
        {
          sY: 'mouthHeight',
          color: skinDetail,
          fY: true,
          y: { r: 0.2 },
          sX: {
            r: 0.8,
            add: [{ r: -0.2, height: true }],
            min: 1,
            max: { r: 1, a: -1 },
          },
        },

        // Neck
        {
          sX: { r: 0.5 },
          sY: { r: 0.3, otherDim: true, min: 1, max: 3 },
          tY: true,
          fY: true,
          list: [{}, { sY: 1, color: skinShadow }],
        },
      ],
    },
  ],
  person: ReadonlyArray<RenderObject> = [
    {
      minX: 5,
      list: [
        {
          color: [30, 30, 30],
          sY: 2,
          y: -1,
          cX: true,
          sX: [mult(2, 'armWidth'), mult(2, 'torsoWidth')],
          fY: true,
        },
        { sX: { r: 0.5 }, rX: true, list: leftHalf },
        { sX: { r: 0.5 }, fX: true, list: leftHalf },
      ],
    },
  ],
  renderList: ReadonlyArray<RenderObject> = [
    {
      m: 'border',
      list: [
        {
          color: [255, 0, 0],
          gap: 1,
          strip: { r: 0.15, otherDim: true, min: 10 },
          change: { r: -0.9 },
          fY: true,
          list: person,
          cut: true,
        },
      ],
    },
  ],
  variableList = {
    border: getSmallerDim({ r: 0.05 }),
    imgWidth: [{ r: 1 }, mult(-2, 'border')],
    imgHeight: [{ r: 1, height: true }, mult(-2, 'border')],
    imgSquare: getSmallerDim({ r: 1, useSize: ['imgWidth', 'imgHeight'] }),
    imgSquareBigger: getBiggerDim({
      r: 1,
      useSize: ['imgWidth', 'imgHeight'],
    }),
    eyeSize: mult(0.002, 'imgSquareBigger', 1),
    mouthHeight: 'eyeSize',
  }

const sparta: ImageFunction = {
  renderList: renderList,
  background: backgroundColor,
  variableList: variableList,
}

export default sparta
