import { Pos } from './Pos'

export const createPos = (Distance) =>
  class PosDirection extends Pos {
    constructor(args) {
      super()
      this.pos = new Distance(args.pos)
      this.toOtherSide = args.toOtherSide
      this.fromOtherSide = args.fromOtherSide
      this.center = args.center
      this.assignMethods()
    }
  }
