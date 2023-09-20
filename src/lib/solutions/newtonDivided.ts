export interface NewtonDividedDifferenceResult {
	result: number;
	c: { [key: number]: number };
	error?: string;
}

export function newtonDividedDifference(
	allPoints: {
		x: number;
		y: number;
	}[],
	selectedPoints: number[],
	xValue: number
): NewtonDividedDifferenceResult {
	const points = allPoints.filter((pt, idx) => selectedPoints.includes(pt.x));

	const cache: { [key: string]: number } = {};
	const calculateFunctionDiff = (x1: number, x2: number): number => {
		const key = `${x1}-${x2}`;
		if (cache[key]) {
			return cache[key];
		}

		if (Math.abs(x1 - x2) <= 1) {
			cache[key] = (points[x1].y - points[x2].y) / (points[x1].x - points[x2].x);
			return cache[key];
		}

		cache[key] =
			(calculateFunctionDiff(x1, x2 + 1) - calculateFunctionDiff(x1 - 1, x2)) /
			(points[x1].x - points[x2].x);

		return cache[key];
	};

	// c0, c1, c2, ...
	const c: { [key: number]: number } = {
		0: points[0].y
	};

	for (let i = 0; i < points.length - 1; i++) {
		c[i + 1] = calculateFunctionDiff(i + 1, 0);
	}

	const calculateFunction = (x: number): number => {
		let result = 0;
		for (let i = 0; i < points.length; i++) {
			let temp = c[i];
			for (let j = 0; j < i; j++) {
				temp *= x - points[j].x;
			}
			result += temp;
		}
		return result;
	};

	return {
		result: calculateFunction(xValue),
		c
	};
}

// const points = [
// 	{ x: 0, y: 9.81 },
// 	{ x: 20000, y: 9.7487 },
// 	{ x: 40000, y: 9.6879 },
// 	{ x: 60000, y: 9.6879 },
// 	{ x: 80000, y: 9.5682 }
// ];

// console.log(newtonDividedDifference(points, [0, 80000], 42235));
