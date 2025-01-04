import type { Location } from './createPixelArray'
import type { State } from './State'
import type { ColorRgb } from '@/helper/typeColor'
import type { InputDynamicVariable } from '@/helper/typeSize'
import type recordDrawingTools from '@/renderengine/DrawingTools/recordDrawingTools'
import type { Position } from '@/renderengine/getPixelUnits'
import type {
  Dimensions,
  ParameterDimension,
} from '@/renderengine/getPixelUnits/Position'

export type Inherit = {
  clear?: boolean
  color?: ColorRgb
  id?: string
  reflectX?: boolean
  reflectY?: boolean
  rotate?: number
  save?: string
  zInd?: number
}

type SizeAndPos = {
  LineCount?: number
  getRealPosition?: () => { x: number; y: number }
  mask?: (dimensions: Location, push?: boolean) => Location
  points?: Array<() => { x: number; y: number }>
}

export type ArgsInit = Inherit & {
  closed?: boolean
  list?: ReadonlyArray<Tool | false>
  use?: string
  weight?: InputDynamicVariable
}

type ArgsNew = ArgsInit & SizeAndPos

export type Tool = {
  chance?: unknown
  list?: ReadonlyArray<Tool | false>
  name?: keyof typeof recordDrawingTools
  panels?: unknown
  points?: ReadonlyArray<Parameters<Position>[0]>
  rX?: boolean
  rY?: boolean
  rotate?: number
  save?: string
  stripes?: unknown
  targetX?: unknown
  use?: string
  weight?: InputDynamicVariable
}

export type ArgsPrepare = ParameterDimension &
  Parameters<Position>[0] &
  Pick<Tool, 'points'> & {
    rX?: boolean
    rY?: boolean
  }

type ArgsCreate = ArgsPrepare &
  Pick<Tool, 'list' | 'weight'> & {
    clear?: boolean
    color?: ColorRgb
    id?: string
    mask?: unknown
    rotate?: number
    save?: string
    z?: number
  }

class Primitive {
  state: State
  dimensions?: Dimensions
  fromRight?: boolean
  fromBottom?: boolean
  rotate?: boolean
  getColorArray?: (x: number, y: number) => void
  args?: ArgsNew

  constructor(state: State) {
    this.state = state
  }

  /**
   * TODO: Havent these methods present, but not implemented is a valid way to
   * handle optionality, but results in a useless function call. In TypeScript
   * classes there is not really good way to handle optional methods though,
   * because declaring them as an `undefined` property doesn't work, because
   * they won't get overwrittten.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- this should already declare the expected type, even if it is not implemented
  init(_args: ArgsInit): void {}

  draw(): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- this should already declare the expected type, even if it is not implemented
  detailInit(_args: ArgsInit, _inherit: Inherit): void {}

  create(args: ArgsCreate, inherit?: Inherit): this {
    inherit = inherit || {}

    let reflectX: boolean = inherit.reflectX || false
    let reflectY: boolean = inherit.reflectY || false
    let rotate: number = inherit.rotate || 0

    if (rotate >= 360) {
      rotate -= 360
    } else if (rotate < 0) {
      rotate += 360
    }

    // if( rotate === 90 || rotate === 270 ) {
    // 	rotate += ( ( reflectX ? 180 : 0 ) + ( reflectY ? 180 : 0 ) );
    // 	if( rotate >= 360 ) { rotate -=360; }
    // }
    if (rotate === 180) {
      rotate = 0

      reflectX = !reflectX

      reflectY = !reflectY
    }

    if (rotate === 270) {
      rotate = 90

      reflectX = !reflectX

      reflectY = !reflectY
    }

    const newArgs: ArgsNew =
      this.prepareSizeAndPos(
        args,
        reflectX,
        reflectY,
        (this.rotate = rotate === 90),
      ) || {}

    newArgs.reflectX = (args.rX || false) !== reflectX

    newArgs.reflectY = (args.rY || false) !== reflectY

    newArgs.rotate = rotate + (args.rotate || 0)

    if (args.save || inherit.save) {
      newArgs.save = args.save || inherit.save
    } else if (args.color || inherit.color) {
      newArgs.color = args.color || inherit.color
    }

    if (args.clear || inherit.clear) {
      newArgs.clear = true
    }

    if (args.id || inherit.id || newArgs.save) {
      newArgs.id = args.id || inherit.id || newArgs.save
    }

    if (args.mask) {
      newArgs.mask = this.state.pixelSetter.setColorMask
    }

    newArgs.zInd = (inherit.zInd || 0) + (args.z || 0)

    if (args.list) {
      newArgs.list = args.list
    } else {
      this.setColorArray(newArgs)
    }

    this.args = newArgs

    if (this.init) {
      this.init(args)
    }

    if (this.detailInit) {
      this.detailInit(args, inherit)
    }

    return this
  }

  setColorArray(args: {
    clear?: boolean
    color?: ColorRgb
    id?: string
    save?: string
    zInd?: number
  }): void {
    this.getColorArray = this.state.pixelSetter.setColorArray(args)
  }

  // Prepare Size and Position Data for Basic Objects
  prepareSizeAndPos(
    args: ArgsPrepare,
    reflectX: boolean,
    reflectY: boolean,
    rotate: boolean,
  ): SizeAndPos | void {
    this.dimensions = this.state.pixelUnit.getDimensions(
      args,
      (this.fromRight = rotate
        ? (args.fY || false) === reflectY
        : (args.fX || false) !== reflectX),
      (this.fromBottom = rotate
        ? (args.fX || false) !== reflectX
        : (args.fY || false) !== reflectY),
      rotate,
    )
  }
}

export default Primitive
