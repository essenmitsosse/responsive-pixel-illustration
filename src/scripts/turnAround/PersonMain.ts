import BodyMain from './BodyMain'
import { recordColor } from './colors'
import Head from './Head'
import { mover } from './mover'

import type { Rotation, StateTurnAround } from './types'
import type { ColorRgb } from '@/helper/typeColor'
import type { InputDynamicVariable } from '@/helper/typeSize'
import type { Tool } from '@/renderengine/DrawingTools/Primitive'

class PersonMain {
  declare _headSY: number
  declare color: ColorRgb
  declare head: Head
  declare bodyMain: BodyMain
  declare ll: Array<InputDynamicVariable>
  declare state: StateTurnAround
  constructor(state: StateTurnAround) {
    this.ll = state.ll

    this.state = state

    // Sizes and Forms
    this._headSY = state.R(0.1, 0.4)

    // Colors
    const color = state.GR(1, 6) as 1 | 2 | 3 | 4 | 5 | 6

    const argsNew = {
      color: recordColor[`c${color}`],
      colorDark: recordColor[`c${color}D`],
    }

    this.color = argsNew.color

    // Assets
    this.head = new Head(argsNew, state)

    this.bodyMain = new BodyMain(argsNew, state)
  }

  draw(args: {
    rotate: Rotation
    sX: InputDynamicVariable
    sY: InputDynamicVariable
  }): {
    cX: boolean
    color: ColorRgb
    fY: boolean
    list: Array<Tool>
    sX: InputDynamicVariable
    sY: InputDynamicVariable
  } {
    const headSY: InputDynamicVariable = { r: this._headSY, useSize: args.sY }
    const neckSY: InputDynamicVariable = { a: 5 }

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

    const headFinal = mover(
      head,
      {
        sXBase: bodyMain.chest.sX,
        xBase: headXSide,
        xRel: headXSide,
        xAdd: bodyMain.chest.x,
        y: 5,
        z: 100,
      },
      this.ll,
    )

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
