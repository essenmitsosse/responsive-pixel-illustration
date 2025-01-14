import { multiplyColor } from '@/helper/helperColor'

import type { ImageFunction } from './listImage'
import type { ColorRgb } from '@/helper/typeColor'
import type { Tool } from '@/renderengine/DrawingTools/Primitive'

const trex: ImageFunction = () => {
  const white: ColorRgb = [255, 255, 255]
  const ground: ColorRgb = [90, 60, 50]

  const trexsingle = (color: ColorRgb): ReadonlyArray<Tool> => [
    {
      name: 'Obj',
      color,
      sX: { r: 0.25, min: 10 },
      sY: { r: 0.25, min: 5 },
      list: [
        //Head
        {
          name: 'Rect',
          y: { r: 0.4, min: 2 },
          fY: true,
          sX: { r: 0.7 },
          sY: { a: 1 },
          clear: true,
        },
        // Mouth
        { name: 'RoundRect' },
        {
          name: 'Dot',
          x: { r: 0.6 },
          y: { r: 0.25 },
          color: white,
        },
      ],
    },

    {
      name: 'Obj',
      fX: true,
      fY: true,
      sX: { r: 0.85 },
      sY: { r: 0.7 },
      color,
      list: [
        //Body
        {
          name: 'Obj',
          sX: { r: 0.6 },
          list: [
            // Body without Tail
            {
              name: 'RoundRect',
              sY: { r: 0.1, min: 3 },
              fY: true,
              color: multiplyColor(ground, 0.6),
            },
            //Shadow

            {
              name: 'Obj',
              x: { r: 0.4 },
              y: { r: 0.09, min: 2 },
              sX: { r: 0.5, min: 7 },
              sY: { r: 0.5, a: 1 },
              fY: true,
              fX: true,
              color: multiplyColor(color, 0.6),
              list: [
                // Back Leg
                {
                  name: 'Rect',
                  sX: { r: 0.6, min: 2 },
                  fX: true,
                },
                // Leg
                { name: 'Rect', sY: { a: 1 }, fY: true },
                // Feet
                { name: 'Dot', y: { r: 1 }, color: white },
                {
                  name: 'Dot',
                  x: { a: 2 },
                  y: { r: 1 },
                  color: white,
                },
              ],
            },
            {
              name: 'Obj',
              x: { r: 0.3 },
              sX: { r: 0.5, min: 7 },
              sY: { r: 0.5, a: 1 },
              fY: true,
              fX: true,
              list: [
                // Front Leg
                {
                  name: 'Rect',
                  sX: { r: 0.6, min: 2 },
                  fX: true,
                },
                // Leg
                { name: 'Rect', sY: { a: 1 }, fY: true },
                // Feet
                { name: 'Dot', fY: true, color: white },
                {
                  name: 'Dot',
                  x: { a: 2 },
                  fY: true,
                  color: white,
                },
              ],
            },
            {
              name: 'Obj',
              x: { r: -0.02, min: -1, max: 0 },
              y: { r: -0.2, a: 1 },
              sX: { r: 0.25, min: 6 },
              sY: { r: 0.3 },
              list: [
                {
                  name: 'Polygon',
                  points: [
                    { x: { r: -0.1 } },
                    { x: { r: 0.2 }, fX: true },
                    { fX: true, fY: true },
                    { fY: true, y: { a: 1 } },
                  ],
                },
              ],
            },
            //Neck
            { name: 'RoundRect', sY: { r: 0.5, min: 5 } },
            //Torso
            {
              name: 'Rect',
              x: { r: -0.15, max: -3 },
              sX: { r: 0.2, min: 3 },
              y: { r: 0.2 },
              sY: { a: 1 },
            },
            // Arms
            {
              name: 'Rect',
              x: { r: -0.1, max: -2 },
              sX: { r: 0.2, min: 2 },
              y: { r: 0.25, a: 1 },
              sY: { a: 1 },
            },
          ],
        },

        {
          name: 'RoundRect',
          fX: true,
          sX: { r: 0.6 },
          sY: { r: 0.1 },
        },
        // Tail
      ],
    },
  ]

  const renderList: ReadonlyArray<Tool> = [
    { name: 'Rect', sY: { r: 0.4 }, fY: true, color: ground },
    {
      name: 'Obj',
      id: 'trex2',
      sX: { r: 0.5 },
      minX: 15,
      sY: { r: 0.2, a: 5, otherDim: true },
      x: { r: -0.1 },
      y: { r: 0.2 },
      fY: true,
      // Trex
      rX: true,
      list: trexsingle([100, 120, 200]),
    },
    {
      name: 'Obj',
      id: 'trex1',
      sX: { min: 55 },
      sY: { min: 22 },
      mY: { r: 0.07, a: -1 },
      x: { a: -20, r: -0.2 },
      fX: true,
      // Trex
      list: trexsingle([180, 50, 50]),
    },
  ]

  const backgroundColor: ColorRgb = [170, 190, 230]

  return {
    renderList,
    background: backgroundColor,
  }
}

export default trex
