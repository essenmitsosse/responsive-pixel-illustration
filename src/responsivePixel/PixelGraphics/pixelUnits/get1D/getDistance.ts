const getQuick = () => 0;

export const getDistance = (Dimension) =>
	class Distance extends Dimension {
		constructor(axis: boolean, args) {
			super(axis, false, args);
		}

		getDefaults(r, a) {
			if (r === undefined && a === undefined) {
				this.rele = 0;
				this.abs = 0;
				return true;
			}
			this.rele = r || 0;
			this.abs = a || 0;
			return false;
		}

		getQuick = getQuick;
	};
