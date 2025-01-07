import type { ArgsInitArm } from './Arm'
import type { Location } from './createPixelArray'
import type { ArgsInitFill } from './Fill'
import type { ArgsInitFillRandom } from './FillRandom'
import type { ArgsInitLine } from './Line'
import type { ArgsInitObj } from './Obj'
import type { ArgsInitPanels } from './Panels'
import type recordDrawingTools from './recordDrawingTools'
import type { State } from './State'
import type { InitDetailedStripes } from './Stripes'
import type { ColorRgb } from '@/helper/typeColor'
import type { Position } from '@/renderengine/getPixelUnits'
import type {
  Dimensions,
  ParameterDimension,
} from '@/renderengine/getPixelUnits/Position'

type ArgsInit = ArgsInitArm &
  ArgsInitFill &
  ArgsInitFillRandom &
  ArgsInitLine &
  ArgsInitObj &
  ArgsInitPanels

type ArgsInitDetailed = InitDetailedStripes

type PreparePrimitive = ParameterDimension &
  Parameters<Position>[0] & {
    points?: ReadonlyArray<Parameters<Position>[0]>
    rX?: boolean
    rY?: boolean
  }

export type ArgsPrepare = PreparePrimitive

type ToolPrimitive = ArgsInit &
  ArgsInitDetailed &
  ArgsPrepare & {
    clear?: boolean
    color?: ColorRgb
    id?: string
    list?: ReadonlyArray<Tool | false | undefined>
    mask?: boolean
    rX?: boolean
    rY?: boolean
    rotate?: number
    save?: string
    z?: number
  }

export type Tool = ToolPrimitive & {
  name?: keyof typeof recordDrawingTools
}

type Args = {
  clear?: boolean
  color?: ColorRgb
  id?: string
  mask?: (dimensions: Location, push?: boolean) => Location
  reflectX?: boolean
  reflectY?: boolean
  rotate?: number
  save?: string
  zInd?: number
}

export type Inherit = Pick<
  Args,
  | 'clear'
  | 'color'
  | 'id'
  | 'reflectX'
  | 'reflectY'
  | 'rotate'
  | 'save'
  | 'zInd'
>

class Primitive {
  state: State
  dimensions?: Dimensions
  fromRight?: boolean
  fromBottom?: boolean
  rotate?: boolean
  args?: Args

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

  init(_args: ArgsInit): void {}

  draw(): void {}

  detailInit(_args: ArgsInitDetailed): void {}

  create(args: Tool, inherit?: Inherit): this {
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

    this.prepareSizeAndPos(
      args,
      reflectX,
      reflectY,
      (this.rotate = rotate === 90),
    )

    const newArgs: Args = {}

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

    this.setColorArray(newArgs)

    this.args = newArgs

    this.init(args)

    this.detailInit(args)

    return this
  }

  setColorArray(_args: Args): void {}

  // Prepare Size and Position Data for Basic Objects
  prepareSizeAndPos(
    args: ArgsPrepare,
    reflectX: boolean,
    reflectY: boolean,
    rotate: boolean,
  ): void {
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
