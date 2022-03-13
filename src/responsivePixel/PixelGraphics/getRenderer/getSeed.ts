export const getSeed = (getRandom) => {
	const getSeed = getRandom().seed;
	let count = 0;
	const i = [];

	return {
		reset() {
			let l = count;
			while (l--) {
				i[l] = 0;
			}
		},
		get(j) {
			const seed = j || getSeed();
			const nr = (count += 1);

			return function () {
				return getRandom(seed + i[nr]++ || 0);
			};
		},
	};
};
