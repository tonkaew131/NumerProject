export interface LangrangeInterpolationResult {
	result: number;
	l: { [key: number]: number };
	error?: string;
}

export function langrangeInterpolation(
	allPoints: {
		x: number;
		y: number;
	}[],
	selectedPoints: number[],
	xValue: number
): LangrangeInterpolationResult {
	const points = allPoints.filter((pt, idx) => selectedPoints.includes(pt.x));

	const l: { [key: number]: number } = {};

	const n = points.length;
	for (let i = 0; i < n; i++) {
		let up = 1;
		let down = 1;

		for (let j = 0; j < n; j++) {
			if (i == j) continue;

			up *= xValue - points[j].x;
			down *= points[i].x - points[j].x;
		}

		l[i] = up / down;
	}

	let totalSum = 0;
	for (let i = 0; i < n; i++) {
		totalSum += points[i].y * l[i];
	}

	return {
		result: totalSum,
		l
	};
}
