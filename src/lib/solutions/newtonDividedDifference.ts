export function newtonDividedDifference(
	points: {
		x: number;
		y: number;
	}[],
	selectedPoints: number[]
): {
	error?: 'Invalid Points';
} {
	const calculateFunctionDiff = (x1: number, x2: number): number => {
		if (Math.abs(x1 - x2) <= 1) {
			return (points[x1].y - points[x2].y) / (points[x1].x - points[x2].x);
		}

		return (
			(calculateFunctionDiff(x1, x2 + 1) - calculateFunctionDiff(x1 + 1, x2)) /
			(points[x1].x - points[x2].x)
		);
	};

	console.log(points[0].y);
	console.log(calculateFunctionDiff(1, 0));
	console.log(calculateFunctionDiff(2, 0));
	console.log(calculateFunctionDiff(3, 0));
	console.log(calculateFunctionDiff(4, 0));
	return {};
}

const points = [
	{ x: 0, y: 9.81 },
	{ x: 20000, y: 9.7487 },
	{ x: 40000, y: 9.6879 },
	{ x: 60000, y: 9.6879 },
	{ x: 80000, y: 9.5682 }
];

console.log(newtonDividedDifference(points, [0, 20000, 40000, 60000, 80000]));

export const a = 1;
