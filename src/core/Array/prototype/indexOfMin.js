export default function(that, fn) {
	let result = 0;
	that.map(fn).reduce((r, n, i) => {
		if (n < r) {
			r = n;
			result = i;
		}
		return r;
	});
	return result;
}
