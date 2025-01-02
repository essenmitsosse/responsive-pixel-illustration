class Primitive {
  constructor(state) {
    this.state = state
  }

  create(args, inherit) {
    inherit = inherit || {}

    let reflectX = inherit.reflectX || false
    let reflectY = inherit.reflectY || false
    let rotate = inherit.rotate || 0

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

    const newArgs =
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
      this.getColorArray = this.state.pixelSetter.setColorArray(
        newArgs.color,
        newArgs.clear,
        newArgs.zInd,
        newArgs.id,
        this.isRect,
        newArgs.save,
      )
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

  // Prepare Size and Position Data for Basic Objects
  prepareSizeAndPos(args, reflectX, reflectY, rotate) {
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
