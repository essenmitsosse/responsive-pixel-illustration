import BBObj from './BBObj'
import HeadBottom from './HeadBottom'
import HeadTop from './HeadTop'
import Nose from './Nose'
import Rotater from './Rotator'

class Head extends BBObj {
  constructor(args, state) {
    super(state)

    this.color = args.color

    this.colorDark = args.colorDark

    this._sX = this.state.R(0.4, 1.8)

    this.headSideRatio = this.state.R(0.5, 1.5)

    this.headTopFrontSX = this.state.R(0.5, 1.5)

    this.headTopSideSX = this.headTopFrontSX + this.state.R(-0.2, 0.2)

    this.wideJaw = this.headSideRatio > this.headTopSideSX

    this.headTopX = (this.wideJaw ? -1 : 1) * this.state.R(0, 1)

    this.headTopSY = this.state.R(0.2, 0.8)

    this.headTop = new HeadTop(args, state)

    this.headBottom = new HeadBottom(args, state)

    this.nose = new Nose(args, state)
  }

  draw(args) {
    const sX = { r: this._sX, useSize: args.sY }

    this.ll.push(sX)

    const headBottom = new Rotater(
      {
        drawer: this.headBottom,
        id: 'lowerHead',
        rotate: args.rotate,
        baseSX: sX,
        sY: { r: this.headTopSY, useSize: args.sY },
        fY: true,
        roundTop: true,
        roundBottom: true,
      },
      this.state,
    ).result

    const headTop = new Rotater(
      {
        drawer: this.headTop,
        id: 'topHead',
        rotate: args.rotate,
        baseSX: sX,
        frontSX: this.headTopFrontSX,
        sY: { add: [{ r: -1, useSize: headBottom.sY }, args.sY, 2] },
        roundTop: true,
        roundBottom: true,
      },
      this.state,
    ).result

    const nose = new Rotater(
      {
        drawer: this.nose,
        id: 'nose',
        rotate: args.rotate,
        baseSX: sX,
        frontSX: 0.1,
        sY: { a: 2 },
        y: [headTop.sY, -2],
        z: 500,
        side: {
          sXBase: (this.wideJaw ? headTop : headBottom).sX,
          xBase: 1,
          xRel: 1,
          xAdd: this.wideJaw ? headTop.x : undefined,
        },
      },
      this.state,
    ).result

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
