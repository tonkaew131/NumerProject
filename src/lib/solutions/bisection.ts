import { abs, evaluate } from 'mathjs';

export interface BisectionResult {
	result: number;
	iter: number;
	iterations?: { x: number; y: number }[];
	error?: string;
}

export function bisectionSearch(
	xStart: number,
	xEnd: number,
	errorFactor: number,
	func: string
): BisectionResult {
	const result: BisectionResult = { result: 0, iter: 0, iterations: [] };

	if (!func || func.trim().length == 0) {
		result.error = 'Invalid function';
		return result;
	}

	if (xStart >= xEnd) {
		result.error = 'xStart must be less than xEnd';
		return result;
	}

	const MAX_ITER = 1000;
	let iter = 0;
	let temp = 0;
	try {
		temp = evaluate(func, { x: xStart });
	} catch (error) {
		result.error = 'Invalid function';
		return result;
	}
	let xl = xStart;
	let xr = xEnd;
	let xm = (xl + xr) / 2;
	while (iter < MAX_ITER) {
		iter += 1;
		if (iter == MAX_ITER) {
			result.error = 'Max iteration reached';
			break;
		}

		xm = (xl + xr) / 2;
		temp = evaluate(func, { x: xm });

		if (result.iterations) result.iterations.push({ x: xm, y: temp });

		if (abs(temp) < errorFactor) {
			result.result = xm;
			result.iter = iter;
			break;
		}

		if (temp * evaluate(func, { x: xl }) < 0) {
			xr = xm;
		} else {
			xl = xm;
		}
	}

	return result;
}

// console.log(bisectionSearch(0, 10, 0.000001, 'x^2 - 7'));
