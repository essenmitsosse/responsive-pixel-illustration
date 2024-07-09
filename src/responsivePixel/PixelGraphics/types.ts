import { Color } from './Color'

export interface Variable {}

export interface SizeObject {
  a?: number
  r?: number
  debug?: true
  add?: ReadonlyArray<Size>
  useSize?: Size | ReadonlyArray<Size>
  max?: Size | ReadonlyArray<Size>
  min?: Size | ReadonlyArray<Size>
  main?: boolean
  height?: boolean
  random?: Size
  otherDim?: boolean
  save?: string
}

export type Size = number | string | GetLength | GetLinkedVariable | SizeObject

export interface Stripes {
  strip?: ReadonlyArray<Size> | Size
  change?: Size
  random?: Size
  horizontal?: boolean
  gap?: Size
}

export interface RenderObject {
  s?: Size | ReadonlyArray<Size>
  sX?: Size | ReadonlyArray<Size>
  sY?: Size | ReadonlyArray<Size>
  x?: Size | ReadonlyArray<Size>
  y?: Size | ReadonlyArray<Size>
  m?: Size | ReadonlyArray<Size>
  mX?: Size | ReadonlyArray<Size>
  mY?: Size | ReadonlyArray<Size>
  minX?: number
  minY?: number
  minHeight?: Size | ReadonlyArray<Size>
  minWidth?: Size | ReadonlyArray<Size>
  color?: ColorRgb
  c?: boolean
  horizontal?: boolean
  rotate?: 0 | -90 | 90 | 180
  rX?: boolean
  rY?: boolean
  fX?: boolean
  fY?: boolean
  cX?: boolean
  cY?: boolean
  tX?: boolean
  tY?: boolean
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
  z?: number
}

export type Render = RenderObject | ReadonlyArray<RenderObject | undefined>

export type ColorRgb = readonly [number, number, number]

export type PixelArray = ReadonlyArray<ReadonlyArray<Color>>
export interface ImageFunction {
  linkList?: ReadonlyArray<Size | ReadonlyArray<Size>>
  variableList?: Record<string, Variable>
  renderList: ReadonlyArray<Render>
  background: ColorRgb
}

interface GetLength {
  getLength: [Size, Size]
  debug?: true
}

interface GetLinkedVariable {
  getLinkedVariable: () => number
  debug?: true
}
