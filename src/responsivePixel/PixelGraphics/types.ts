import { Color } from './Color'

export interface Variable {}

export interface SizeObject {
  a?: number
  r?: number
  debug?: true
  add?: ReadonlyArray<Size> | ReadonlyArray<ReadonlyArray<Size>>
  useSize?: Size
  max?: Size | ReadonlyArray<Size>
  min?: Size | ReadonlyArray<Size>
  main?: boolean
  height?: boolean
}

export type Size = number | string | GetLength | GetLinkedVariable | SizeObject

export interface Stripes {
  strip: ReadonlyArray<Size>
}

export interface RenderObject {
  sX?: Size | ReadonlyArray<Size>
  sY?: Size | ReadonlyArray<Size>
  x?: Size | ReadonlyArray<Size>
  y?: Size | ReadonlyArray<Size>
  m?: Size | ReadonlyArray<Size>
  color?: ColorRgb
  rotate?: 0 | -90 | 90 | 180
  rY?: boolean
  fX?: boolean
  cX?: boolean
  list?: Render
  mask?: boolean
  stripes?: Stripes
}

export type Render = RenderObject | ReadonlyArray<RenderObject>

export type ColorRgb = readonly [number, number, number]

export type PixelArray = ReadonlyArray<ReadonlyArray<Color>>
export interface ImageFunction {
  linkList?: ReadonlyArray<Size>
  variableList?: Record<string, Variable>
  renderList: ReadonlyArray<Render>
  background: ColorRgb
}

interface GetLength {
  getLength: [number, number]
  debug?: true
}

interface GetLinkedVariable {
  getLinkedVariable: () => number
  debug?: true
}
