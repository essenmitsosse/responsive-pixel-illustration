import { Variable } from './Variable';
import { VariableDynamic } from './VariableDynamic';

export const createVariableList = (vl) => {
	const newVL = Object.fromEntries(Object.keys(vl).map((key) => [
		key,
		new Variable(vl[key], key, this.pixelUnits),
	]));
	return {
		listLink: (name, vari) => {
			if (newVL[name]) {
				newVL[name].link(vari);
			} else {
				newVL[name] = new VariableDynamic(name);
				newVL[name].link(vari);
			}
		},
		listCreate: (name) => {
			if (!newVL[name]) {
				newVL[name] = new VariableDynamic(name);
			}
			return newVL[name];
		},
		updater: () => {
			Object.values(newVL).forEach((value) => value.set());
		},
	};
};
