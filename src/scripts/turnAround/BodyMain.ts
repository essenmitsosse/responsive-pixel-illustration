import BBObj from './BBObj'
import Chest from './Chest'
import LowerBody from './LowerBody'
import Rotater from './Rotator'

import type { Rotation, StateTurnAround } from './BBObj'
import type { What } from './types'
import type { ColorRgb } from '@/helper/typeColor'
import type { InputDynamicVariable } from '@/helper/typeSize'

type ArgsBodyMain = {
  color: ColorRgb
  colorDark: ColorRgb
}

class BodyMain extends BBObj {
  declare chest: Chest
  declare lowerBody: LowerBody
  declare _sX: number
  declare _chestSY: number
  declare chestSX: number
  declare torsoSide: number
  declare chestSideSX: number
  declare chestFrontSX: number
  declare color: ColorRgb
  declare colorDark: ColorRgb
  constructor(args: ArgsBodyMain, state: StateTurnAround) {
    super(state)

    // Forms & Sizes
    this._sX = this.state.R(0.4, 1)

    this._chestSY = this.state.R(0.1, 0.3)

    this.chestSX = this.state.GR(-1, 1)

    this.torsoSide = this.state.R(0.5, 1.5)

    this.chestSideSX = this.state.R(0.8, 1.2)

    this.chestFrontSX = this.state.R(0.8, 1.2)

    // Colors
    this.color = args.color

    this.colorDark = args.colorDark

    // Assets
    this.chest = new Chest(state)

    this.lowerBody = new LowerBody(state)
  }

  draw(args: {
    fY?: boolean
    rotate: Rotation
    sY: InputDynamicVariable
    z?: number
  }): Omit<What, 'id' | 'list' | 'rotate'> & {
    chest: Omit<What, 'id' | 'list'>
    lowerBody: Omit<What, 'id' | 'list'>
  } {
    const sX = { r: this._sX, useSize: args.sY }
    const chestSY = { r: this._chestSY, useSize: args.sY }
    const lowerBodySY = [args.sY, { r: -1, useSize: chestSY }]

    this.ll.push(sX)

    this.ll.push(chestSY)

    this.ll.push(lowerBodySY)

    let lowerBody = new Rotater(
      {
        drawer: this.lowerBody,
        id: 'lowerBody',
        rotate: args.rotate,
        baseSX: sX,
        sY: lowerBodySY,
        fY: true,
        z: 20,
      },
      this.state,
    ).result

    const chest = new Rotater(
      {
        drawer: this.chest,
        id: 'chest',
        rotate: args.rotate,
        baseSX: sX,
        frontSX: this.chestFrontSX,
        sY: chestSY,
        z: 40,
      },
      this.state,
    ).result

    lowerBody = this.mover(lowerBody, {
      xRel: 0,
      max: { a: 2 },
    })

    return {
      get: {
        sY: args.sY,
        fY: args.fY,
        z: args.z,
        list: [chest.get, lowerBody.get],
      },
      chest,
      lowerBody,
    }
  }
}

export default BodyMain
