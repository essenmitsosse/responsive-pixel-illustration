import { GetRandom } from "../getGetRandom";

export class Seed {
	private getRandom: GetRandom;
	private getSeed: () => number;
	private count: number;
	private i: Array<number>;
	constructor(getRandom: GetRandom) {
		this.getRandom = getRandom;
		this.getSeed = getRandom().seed;
		this.count = 0;
		this.i = [];
	}

	reset() {
		let l = this.count;
		while (l--) {
			this.i[l] = 0;
		}
	}
	get(j) {
		const seed = j || this.getSeed();
		const nr = (this.count += 1);
		const that: Seed = this;

		return function () {
			return that.getRandom(seed + that.i[nr]++ || 0);
		};
	}
}
