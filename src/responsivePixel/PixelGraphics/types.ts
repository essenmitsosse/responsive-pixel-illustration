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
  random?: { r: number }
}

export type Size = number | string | GetLength | GetLinkedVariable | SizeObject

export interface Stripes {
  strip: number | ReadonlyArray<Size>
  random: Size
}

export interface RenderObject {
  s?: Size
  sX?: Size | ReadonlyArray<Size>
  sY?: Size | ReadonlyArray<Size>
  x?: Size | ReadonlyArray<Size>
  y?: Size | ReadonlyArray<Size>
  m?: Size | ReadonlyArray<Size>
  minX?: number
  minY?: number
  color?: ColorRgb
  rotate?: 0 | -90 | 90 | 180
  rY?: boolean
  fX?: boolean
  fY?: boolean
  cX?: boolean
  cY?: boolean
  list?: Render
  mask?: boolean
  stripes?: Stripes
  use?: string
  chance?: number
  name?: string
  clear?: boolean
  save?: string
  id?: string
  points?: ReadonlyArray<RenderObject>
}

export type Render = RenderObject | ReadonlyArray<RenderObject | undefined>

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
