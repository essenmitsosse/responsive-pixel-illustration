import Primitive from './Primitive'

// Initing a new Object, converting its List into real Objects.
const convertList = (list, inherit, drawingTools, state) => {
  // Loops through the List of an Object
  const l = list ? list.length : 0

  let i = 0

  const newList = []

  let newTool

  do {
    newTool = list[i]

    if (newTool) {
      newList.push(
        new drawingTools[
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
        ](state, drawingTools).create(newTool, inherit),
      )
    }
  } while ((i += 1) < l)

  return newList
}

class Obj extends Primitive {
  constructor(state, drawingTools) {
    super(state)

    this.drawingTools = drawingTools
  }

  init() {
    const list = this.args.list || this.list

    if (list) {
      this.args.list = convertList(
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
        this.drawingTools,
        this.state,
      )
    }
  }
  // ------ End Object Init

  // Draws Object, consisting of other Objects and Primitives.
  draw() {
    let l = this.args.list.length

    const dimensions = this.dimensions.calc()

    let oldMask

    if (dimensions.checkMin()) {
      return
    }

    if (this.args.mask) {
      oldMask = this.args.mask(dimensions, true)
    }

    this.state.pixelUnit.push(dimensions)

    while (l--) {
      this.args.list[l].draw()
    }

    if (this.args.mask) {
      this.args.mask(oldMask, false)
    }

    this.state.pixelUnit.pop()
  }
}

export default Obj
