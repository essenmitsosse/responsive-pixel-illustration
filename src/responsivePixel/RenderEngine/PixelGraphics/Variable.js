export class Variable {
	constructor(args, name, pixelUnits) {
		if (args) {
			this.name = name;
			this.vari = pixelUnits.createSize(args);
			this.linkedP = [];
		}
	}

	set() {
		const value = this.vari.getReal();
		this.linkedP.forEach((_, key) => {
			this.linkedP[key].abs = value;
		});
	}

	link(p) {
		this.linkedP.push(p);
	}
}
