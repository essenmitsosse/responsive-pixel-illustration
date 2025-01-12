import Primitive from './Primitive'

import type { ArgsInitArm } from './Arm'
import type { ArgsInitPanels } from './Panels'
import type { Inherit, Tool } from './Primitive'
import type recordDrawingToolsForType from './recordDrawingTools'
import type { State } from './State'
import type { InitStripes } from './Stripes'

type ToolClasses =
  (typeof recordDrawingToolsForType)[keyof typeof recordDrawingToolsForType]

type ToolInstance = InstanceType<ToolClasses>

export type ArgsInitObj = { list?: ReadonlyArray<Tool | false | undefined> }

// Initing a new Object, converting its List into real Objects.
const convertList = (
  list: ReadonlyArray<Tool | false | undefined>,
  inherit: Inherit,
  recordDrawingTools: typeof recordDrawingToolsForType,
  state: State,
): ReadonlyArray<ToolInstance> =>
  list
    .filter((newTool) => newTool !== undefined && newTool !== false)
    .map((newTool): ToolInstance => {
      const nameDrawingTool =
        newTool.name ||
        (newTool.stripes
          ? 'Stripes'
          : newTool.list
            ? 'Obj'
            : newTool.points
              ? newTool.weight
                ? 'Line'
                : 'Polygon'
              : newTool.use
                ? newTool.chance
                  ? 'FillRandom'
                  : 'Fill'
                : newTool.panels
                  ? 'Panels'
                  : newTool.targetX
                    ? 'Arm'
                    : 'Rect')

      const DrawingTool = recordDrawingTools[nameDrawingTool]
      const drawingTool = new DrawingTool(state, recordDrawingTools)

      drawingTool.create(newTool, inherit)

      return drawingTool
    })
    .toReversed()

class Obj extends Primitive {
  recordDrawingTools: typeof recordDrawingToolsForType
  listTool?: ReadonlyArray<ToolInstance>
  constructor(
    state: State,
    recordDrawingTools: typeof recordDrawingToolsForType,
  ) {
    super(state)

    this.recordDrawingTools = recordDrawingTools
  }

  init(args: ArgsInitArm & ArgsInitObj & ArgsInitPanels & InitStripes): void {
    if (this.args === undefined) {
      throw new Error('Unexpected error: args is undefined')
    }

    const list = args.list || ('list' in this ? this.list : undefined)

    if (list) {
      this.listTool = Array.isArray(list)
        ? convertList(list, this.args, this.recordDrawingTools, this.state)
        : []
    }
  }
  // ------ End Object Init

  // Draws Object, consisting of other Objects and Primitives.
  draw(): void {
    if (this.dimensions === undefined) {
      throw new Error('Unexpected error: dimensions is undefined')
    }

    if (this.listTool === undefined) {
      throw new Error('Unexpected error: listTool is undefined')
    }

    const dimensions = this.dimensions.calc()

    let oldMask

    if (dimensions.checkMin()) {
      return
    }

    if (this.mask) {
      oldMask = this.mask(dimensions, true)
    }

    this.state.pixelUnit.push(dimensions)

    this.listTool.forEach((tool) => tool.draw())

    if (this.mask && oldMask) {
      this.mask(oldMask, false)
    }

    this.state.pixelUnit.pop()
  }
}

export default Obj
