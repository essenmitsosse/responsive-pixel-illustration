import { getSmallerDim, mult, sub, getRandomInt } from '../helperPixelGraphics'
import { ColorRgb, ImageFunction, Render } from '../PixelGraphics/types'

const backgroundColor: ColorRgb = [0, 0, 0],
  colorNr = getRandomInt(4),
  dayNight = getRandomInt(2),
  sunPos = getRandomInt(2),
  mountains = getRandomInt(2),
  clouds = getRandomInt(2),
  tree = getRandomInt(2),
  colorScheme: ReadonlyArray<
    [
      [number, number, number],
      [number, number, number],
      [number, number, number],
      [number, number, number],
    ]
  > = [
    [
      [255, 255, 255],
      [180, 180, 180],
      [100, 100, 100],
      [40, 40, 40],
    ],
    [
      [0, 255, 255],
      [0, 180, 180],
      [0, 100, 100],
      [0, 40, 40],
    ],
    [
      [255, 0, 255],
      [180, 0, 180],
      [100, 0, 100],
      [40, 0, 40],
    ],
    [
      [255, 255, 0],
      [180, 180, 0],
      [100, 100, 0],
      [40, 40, 0],
    ],
  ],
  c1 = colorScheme[colorNr]![0],
  c2 = colorScheme[colorNr]![1],
  c3 = colorScheme[colorNr]![2],
  c4 = colorScheme[colorNr]![3],
  renderList: ReadonlyArray<Render> = [
    {
      m: 'borderS',
      list: [
        { color: [c3, c4][dayNight], use: 'sky' },
        clouds === 0
          ? dayNight === 1
            ? { color: c2, use: 'sky', chance: 0.01 }
            : {
                color: c2,
                use: 'sky',
                chance: 0.02,
                sX: { a: 1, random: { r: 0.1 } },
              }
          : undefined,
        { save: 'sky' },
        {
          s: 'sunS',
          color: c2,
          x: 'sunPosX',
          y: 'sunPosY',
          id: 'sun',
          list: [
            // Sun
            { name: 'Dot', clear: true },
            { name: 'Dot', clear: true, fX: true },
            { name: 'Dot', clear: true, fY: true },
            { name: 'Dot', clear: true, fX: true, fY: true },
            dayNight === 1
              ? { s: { r: 0.4 }, fX: true, cY: true, clear: true }
              : undefined,
            {},
          ],
        },
        {
          color: [c2, c3][dayNight],
          y: 'horizontSY',
          fY: true,
          sY: 'mountainSY',
          minY: 1,
          list: [
            // Mountains
            {
              points: [
                { fY: true },
                { y: { r: 0.4 } },
                { x: { r: 0.2 } },
                { x: { r: 0.6 }, y: { r: 0.6 } },
                { x: { r: 0.8 }, y: { r: 0.4 } },
                { fX: true, y: { r: 0.7 } },
                { fY: true, fX: true },
              ],
            },
          ],
        },
        {
          sY: 'horizontSY',
          fY: true,
          color: [c2, c3, c2, c3][dayNight + sunPos],
        }, // Ground
        tree === 0
          ? {
              color: c4,
              list: [
                { sX: { r: 0.1 }, x: { r: 0.2 } },
                {
                  sY: { a: 1 },
                  sX: { r: 0.6 },
                  stripes: { strip: 2, random: { r: 0.2 } },
                },
              ],
            }
          : undefined,
      ],
    }, // END images

    {
      color: c4,
      list: [
        { sY: 'borderS' },
        { sY: 'borderS', fY: true },
        { sX: 'borderS' },
        { sX: 'borderS', fX: true },
      ],
    },
  ],
  variableList = {
    width: { r: 1 },
    height: { r: 1, height: true },
    squ: { a: 'width', max: 'height' },

    borderS: { r: 0.03, a: 1, useSize: 'squ', min: 1 },

    imgSX: ['width', mult(-2, 'borderS')],
    imgSY: ['height', mult(-2, 'borderS')],

    imgSqu: getSmallerDim({ r: 1, useSize: ['imgSX', 'imgSY'] }),

    horizontSY: {
      r: [0.1, 0.25, 0.5, 0.7][sunPos + clouds],
      useSize: 'imgSY',
    },
    mountainSY: { r: [0, 0.6][mountains], useSize: 'imgSqu' },

    skySY: ['imgSY', sub('horizontSY')],
    skyMountainSY: ['skySY', mult(-0.5, 'mountainSY')],

    sunPosX: { r: [0.2, 0.6][sunPos] },
    sunPosY: { r: [0.1, 0.5][sunPos], useSize: 'skyMountainSY' },
    sunS: mult(0.15, 'imgSqu'),
  }

const image: ImageFunction = {
  renderList,
  variableList,
  background: backgroundColor,
}

export default image
