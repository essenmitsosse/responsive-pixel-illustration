import { Axis } from "./Axis";

export class Pos extends Axis {
  calc() {
    return this.calcPos();
  }

  normal() {
    return this.pos.getReal();
  }

  toOther() {
    return this.pos.getReal() - 1;
  }

  center() {
    return this.pos.getReal() + Math.floor(this.dim / 2);
  }

  fromOther() {
    return this.pos.fromOtherSide(1);
  }

  fromOtherToOther() {
    return this.pos.fromOtherSide(0);
  }

  fromOtherCenter() {
    return this.pos.fromOtherSide(1) - Math.floor(this.dim / 2);
  }
}
