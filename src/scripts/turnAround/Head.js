import BBObj from './BBObj'
import HeadBottom from './HeadBottom'
import HeadTop from './HeadTop'
import Nose from './Nose'
import Rotater from './Rotator'

class Head extends BBObj {
  constructor(args) {
    super()

    this.color = args.color || [255, 0, 0]

    this.colorDark = args.colorDark || [150, 0, 0]

    this._sX = this.R(0.4, 1.8)

    this.headSideRatio = this.R(0.5, 1.5)

    this.headTopFrontSX = this.R(0.5, 1.5)

    this.headTopSideSX = this.headTopFrontSX + this.R(-0.2, 0.2)

    this.wideJaw = this.headSideRatio > this.headTopSideSX

    this.headTopX = (this.wideJaw ? -1 : 1) * this.R(0, 1)

    this.headTopSY = this.R(0.2, 0.8)

    this.headTop = new HeadTop(args)

    this.headBottom = new HeadBottom(args)

    this.nose = new Nose(args)
  }

  draw(args) {
    this.ll.push((this.sX = { r: this._sX, useSize: args.sY }))

    const headBottom = new Rotater({
      drawer: this.headBottom,
      id: 'lowerHead',
      rotate: args.rotate,
      baseSX: this.sX,
      sideSX: this.headSideRatio,
      sY: { r: this.headTopSY, useSize: args.sY },
      fY: true,
      roundTop: true,
      roundBottom: true,
    }).result

    const headTop = new Rotater({
      drawer: this.headTop,
      id: 'topHead',
      rotate: args.rotate,
      baseSX: this.sX,
      frontSX: this.headTopFrontSX,
      sideSX: this.headTopSideSX,
      sideBaseSX: headBottom.sX,
      sideX: this.headTopX,
      sY: { add: [{ r: -1, useSize: headBottom.sY }, args.sY, 2] },
      roundTop: true,
      roundBottom: true,
    }).result

    const nose = new Rotater({
      drawer: this.nose,
      id: 'nose',
      rotate: args.rotate,
      baseSX: this.sX,
      frontSX: 0.1,
      sideSX: 0.5,
      sY: { a: 2 },
      y: [headTop.sY, -2],
      z: 500,
      side: {
        sXBase: (this.wideJaw ? headTop : headBottom).sX,
        xBase: 1,
        xRel: 1,
        xAdd: this.wideJaw && headTop.x,
      },
    }).result

    // this.ll.push(
    // 	sizes.headTopSY = { r:this.headTopSY, useSize:args.sY },
    // 	sizes.headBottomSY = [ { r:-1, useSize: sizes.headTopSY }, args.sY ]
    // );

    return {
      get: {
        color: this.color,
        sY: args.sY,
        list: [headTop.get, headBottom.get, nose.get],
      },
      headTop,
      headBottom,
      nose,
      sX: headBottom.sX,
      sY: args.sY,
      rotate: args.rotate,
    }
  }
}

export default Head
