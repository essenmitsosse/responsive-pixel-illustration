export class Axis {
	calc() {
		this.realSize =
			this.size.getReal() - (this.realMargin = this.margin ? this.margin.getReal() : 0) * 2;
		this.realPos = this.calcPos();
	}

	get getSize() {
		return this.realSize;
	}

	get getPos() {
		return this.realPos;
	}

	get getEnd() {
		return this.realPos + this.realSize;
	}

	normal() {
		return this.pos.getReal() + this.realMargin;
	}

	toOther() {
		return this.pos.getReal() + this.realMargin - this.realSize;
	}

	fromCenter() {
		return this.pos.getReal() + Math.floor((this.dim - this.realSize) / 2);
	}

	fromOther() {
		return this.pos.fromOtherSide(this.realSize) - this.realMargin;
	}

	fromOtherToOther() {
		return this.pos.fromOtherSide(0) + this.realMargin;
	}

	fromOtherCenter() {
		return this.pos.fromOtherSide(this.realSize) - Math.floor((this.dim - this.realSize) / 2);
	}

	assignMethods() {
		if (this.center) {
			this.calcPos = this.fromOtherSide ? this.fromOtherCenter : this.fromCenter;
		} else if (this.toOtherSide) {
			this.calcPos = this.fromOtherSide ? this.fromOtherToOther : this.toOther;
		} else {
			this.calcPos = this.fromOtherSide ? this.fromOther : this.normal;
		}
	}
}
