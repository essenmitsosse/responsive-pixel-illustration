import Primitive from './Primitive'

// Initing a new Object, converting its List into real Objects.
const convertList = (list, inherit, recordDrawingTools, state) =>
  list
    .filter((newTool) => newTool !== undefined && newTool !== false)
    .map((newTool) => {
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
  constructor(state, recordDrawingTools) {
    super(state)

    this.recordDrawingTools = recordDrawingTools
  }

  init() {
    if (this.args === undefined) {
      throw new Error('Unexpected error: args is undefined')
    }

    const list = this.args.list || ('list' in this ? this.list : undefined)

    if (list) {
      this.listTool = Array.isArray(list)
        ? convertList(
            list,
            {
              // Things to inherit to Children
              color: this.args.color,
              clear: this.args.clear,
              reflectX: this.args.reflectX,
              reflectY: this.args.reflectY,
              zInd: this.args.zInd,
              id: this.args.id,
              save: this.args.save,
              rotate: this.args.rotate,
            },
            this.recordDrawingTools,
            this.state,
          )
        : []
    }
  }
  // ------ End Object Init

  // Draws Object, consisting of other Objects and Primitives.
  draw() {
    const dimensions = this.dimensions.calc()

    let oldMask

    if (dimensions.checkMin()) {
      return
    }

    if (this.args.mask) {
      oldMask = this.args.mask(dimensions, true)
    }

    this.state.pixelUnit.push(dimensions)

    this.listTool.forEach((tool) => tool.draw())

    if (this.args.mask) {
      this.args.mask(oldMask, false)
    }

    this.state.pixelUnit.pop()
  }
}

export default Obj
