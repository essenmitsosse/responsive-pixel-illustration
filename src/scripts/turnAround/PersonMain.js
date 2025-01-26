import BBObj from './BBObj'
import BodyMain from './BodyMain'
import Head from './Head'
import Neck from './Neck'

class PersonMain extends BBObj {
  constructor(args, state) {
    super(state)

    // Sizes and Forms
    this._headSY = this.state.R(0.1, 0.4)

    // Colors
    const color = this.state.GR(1, 6)

    const argsNew = {
      ...args,
      color: this[`c${color}`],
      colorDark: this[`c${color}D`],
    }

    this.color = argsNew.color

    this.colorDark = argsNew.colorDark

    // Assets
    this.head = new Head(argsNew, state)

    this.neck = new Neck(argsNew, state)

    this.bodyMain = new BodyMain(argsNew, state)
  }

  draw(args) {
    const headSY = { r: this._headSY, useSize: args.sY }
    const neckSY = { a: 5 }

    const bodySY = [
      args.sY,
      { r: -1, useSize: headSY },
      { r: -1, useSize: neckSY },
      1,
    ]

    this.ll.push(headSY)

    this.ll.push(neckSY)

    this.ll.push(bodySY)

    const head = this.head.draw({
      sY: headSY,
      rotate: args.rotate,
    })

    const bodyMain = this.bodyMain.draw({
      sX: args.sX,
      sY: bodySY,
      rotate: args.rotate,
      fY: true,
    })

    const neckSX = {
      r: 0.5,
      useSize: head.sX,
      max: { r: 0.5, useSize: bodyMain.chest.sX },
    }

    this.ll.push(neckSX)

    const headXSide = 1

    const headFinal = this.mover(head, {
      sXBase: bodyMain.chest.sX,
      xBase: headXSide,
      xRel: headXSide,
      xAdd: bodyMain.chest.x,
      y: 5,
      z: 100,
    })

    return {
      color: this.color,
      sY: args.sY,
      sX: args.sX,
      cX: true,
      fY: true,
      list: [headFinal.get, bodyMain.get],
    }
  }
}

export default PersonMain
