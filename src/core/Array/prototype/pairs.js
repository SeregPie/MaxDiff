export default function(that) {
	let result = [];
	let ii = that.length;
	for (let i0 = 0, ii0 = ii - 1; i0 < ii0; i0++) {
		for (let i1 = i0 + 1, ii1 = ii0 + 1; i1 < ii1; i1++) {
			result.push([that[i0], that[i1]]);
		}
	}
	return result;
}
