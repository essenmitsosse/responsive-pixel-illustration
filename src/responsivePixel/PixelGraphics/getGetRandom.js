export const getGetRandom = () => {
	const m = 2147483647;
	const a = 16807;
	const c = 17;
	const z = 3;
	let i = 0;
	return (seed) => {
		let thisZ = seed || z;
		return {
			one() {
				thisZ = (a * thisZ + c) % m;
				return thisZ / m;
			},
			count(count) {
				thisZ = (a * thisZ + count) % m;
				return Math.floor((thisZ / m) * count);
			},
			seed() {
				thisZ = (a * thisZ + c) % m;
				i += 1;
				return thisZ + i;
			},
		};
	};
};
