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
      color: this['c' + color],
      colorDark: this['c' + color + 'D'],
    }

    this.color = argsNew.color

    this.colorDark = argsNew.colorDark

    // Assets
    this.head = new Head(argsNew, state)

    this.neck = new Neck(argsNew, state)

    this.bodyMain = new BodyMain(argsNew, state)
  }

  draw(args) {
    this.ll.push((this.headSY = { r: this._headSY, useSize: args.sY }))

    this.ll.push((this.neckSY = { a: 5 }))

    this.ll.push(
      (this.bodySY = [
        args.sY,
        { r: -1, useSize: this.headSY },
        { r: -1, useSize: this.neckSY },
        1,
      ]),
    )

    let head = this.head.draw({
      sY: this.headSY,
      rotate: args.rotate,
    })

    const bodyMain = this.bodyMain.draw({
      sX: args.sX,
      sY: this.bodySY,
      rotate: args.rotate,
      fY: true,
    })

    this.ll.push(
      (this.neckSX = {
        r: 0.5,
        useSize: head.sX,
        max: { r: 0.5, useSize: bodyMain.chest.sX },
      }),
    )

    this.headXSide = 1

    head = this.mover(head, {
      sXBase: bodyMain.chest.sX,
      xBase: this.headXSide,
      xRel: this.headXSide,
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
      list: [head.get, bodyMain.get],
    }
  }
}

export default PersonMain
