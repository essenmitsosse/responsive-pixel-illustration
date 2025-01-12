import getIsColorRgb from '@/helper/getIsColorRgb'
import getIsUnknownObject from '@/lib/getIsUnknownObject'

import type { ArgsInitArm } from './Arm'
import type { Location } from './createPixelArray'
import type { ArgsPrepareDot } from './Dot'
import type { ArgsInitFill } from './Fill'
import type { ArgsInitFillRandom, ArgsPrepareFillRandom } from './FillRandom'
import type { ArgsInitLine, ArgsPrepareLine } from './Line'
import type { ArgsInitObj } from './Obj'
import type { ArgsInitPanels } from './Panels'
import type recordDrawingTools from './recordDrawingTools'
import type { State } from './State'
import type { InitStripes } from './Stripes'
import type { ColorRgb } from '@/helper/typeColor'
import type {
  Dimensions,
  ParameterDimension,
} from '@/renderengine/getPixelUnits/Position'

type ArgsInit = ArgsInitArm &
  ArgsInitFill &
  ArgsInitFillRandom &
  ArgsInitLine &
  ArgsInitObj &
  ArgsInitPanels &
  InitStripes

type ArgsPreparePrimitive = ParameterDimension & {
  fX?: boolean
  fY?: boolean
}

type ArgsPrepare = ArgsPrepareDot &
  ArgsPrepareFillRandom &
  ArgsPrepareLine &
  ArgsPreparePrimitive

type ToolPrimitive = ArgsInit &
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
  mask?: (dimensions: Location, push?: boolean) => Location

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

  create(args: unknown, inherit?: Inherit): this {
    if (!getIsUnknownObject(args)) {
      throw new Error('Unexpected error: args is not an object')
    }

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

    if (
      args.rotate !== undefined &&
      args.rotate !== false &&
      typeof args.rotate !== 'number'
    ) {
      throw new Error(
        `Unexpected error: args.rotate is defined and not a number, it is: ${typeof args.rotate} (${JSON.stringify(args.rotate)})`,
      )
    }

    newArgs.rotate = rotate + (args.rotate || 0)

    if (args.save || inherit.save) {
      if (
        args.save !== undefined &&
        args.save !== false &&
        typeof args.save !== 'string'
      ) {
        throw new Error(
          `Unexpected error: args.save is defined and not a string, it is: ${typeof args.save} (${JSON.stringify(args.save)})`,
        )
      }

      newArgs.save = args.save || inherit.save
    } else if (args.color || inherit.color) {
      if (
        args.color !== undefined &&
        args.color !== false &&
        getIsColorRgb(args.color) === false
      ) {
        throw new Error(
          `Unexpected error: args.color is defined and is not a RGB value and not a list of RGB value, it is: ${typeof args.color} (${JSON.stringify(args.color)})`,
        )
      }

      newArgs.color = args.color || inherit.color
    }

    if (args.clear || inherit.clear) {
      newArgs.clear = true
    }

    if (args.id || inherit.id || newArgs.save) {
      if (
        args.id !== undefined &&
        args.id !== false &&
        typeof args.id !== 'string'
      ) {
        throw new Error(
          `Unexpected error: args.id is defined and not a string, it is: ${typeof args.id} (${JSON.stringify(args.id)})`,
        )
      }

      newArgs.id = args.id || inherit.id || newArgs.save
    }

    if (args.mask) {
      this.mask = this.state.pixelSetter.setColorMask
    }

    if (
      args.z !== undefined &&
      args.z !== false &&
      typeof args.z !== 'number'
    ) {
      throw new Error(
        `Unexpected error: args.z is defined and not a number, it is: ${typeof args.z} (${JSON.stringify(args.z)})`,
      )
    }

    newArgs.zInd = (inherit.zInd || 0) + (args.z || 0)

    this.setColorArray(newArgs)

    this.args = newArgs

    this.init(args)

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
