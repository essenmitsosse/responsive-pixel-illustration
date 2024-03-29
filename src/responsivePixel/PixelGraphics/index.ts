import { getRenderer } from "./getRenderer";
import { getPixelUnits, PixelUnit } from "./pixelUnits";
import { getGetRandom } from "./getGetRandom";
import { Variable } from "./Variable";
import { VariableDynamic } from "./VariableDynamic";
import type { Redraw } from "./getRenderer";
import type { ImageFunction, Size } from "./types";

export class PixelGraphics {
	public getRandom = getGetRandom();
	public pixelUnit: PixelUnit;

	private variableList = {};
	private imageFunction: ImageFunction;
	public redraw: Redraw;

	constructor(args: {
		imageFunction: ImageFunction;
		divCanvas: HTMLCanvasElement;
		pixelSize: number;
	}) {
		this.pixelUnit = getPixelUnits(); // Initialize PixelUnits with Variables

		this.imageFunction = args.imageFunction;

		this.pixelUnit.setList(this.createVariableList());
		if (this.imageFunction.linkList) {
			this.prepareVariableList(this.imageFunction.linkList);
		}

		Object.entries(
			this.imageFunction.variableList || ([] as ReadonlyArray<Variable>)
		).forEach(([key, value]) => {
			this.variableList[key] = new Variable(value, key, this.pixelUnit);
		});

		this.redraw = getRenderer(args, this);
	}

	prepareVariableList(vl: ReadonlyArray<Size>) {
		if (vl.length === 0) {
			return;
		}
		const getLinkedVariable = (variable: Size) => () => {
			if (!variable.calculated) {
				/* eslint-disable-next-line no-param-reassign */
				variable.calculated = true;
				/* eslint-disable-next-line no-param-reassign */
				variable.real = variable.s.getReal();
			}
			return variable.real;
		};

		vl.forEach((current) => {
			if (!current.s) {
				if (!current.autoUpdate) {
					/* eslint-disable-next-line no-param-reassign */
					current.autoUpdate = false;
					/* eslint-disable-next-line no-param-reassign */
					current.s = this.pixelUnit.createSize(current);
				} else {
					/* eslint-disable-next-line no-param-reassign */
					current.calculated = true;
				}
				/* eslint-disable-next-line no-param-reassign */
				current.getLinkedVariable = getLinkedVariable(current);
			}
		});

		this.pixelUnit.linkList((dimensions) => {
			vl.forEach((current) => {
				if (current.main) {
					/* eslint-disable-next-line no-param-reassign */
					current.calculated = true;
					/* eslint-disable-next-line no-param-reassign */
					current.real =
						dimensions[current.height ? "height" : "width"];
				} else {
					/* eslint-disable-next-line no-param-reassign */
					current.calculated = current.autoUpdate;
				}
			});
		});
	}

	createVariableList() {
		return {
			variableListLink: (name, vari) => {
				if (this.variableList[name]) {
					this.variableList[name].link(vari);
				} else {
					this.variableList[name] = new VariableDynamic(name);
					this.variableList[name].link(vari);
				}
			},
			variableListCreate: (name) => {
				if (!this.variableList[name]) {
					this.variableList[name] = new VariableDynamic(name);
				}
				return this.variableList[name];
			},
			updateList: () => {
				Object.values(this.variableList).forEach((value) => {
					value.set();
				});
			},
		};
	}
}
