import { abs, evaluate } from 'mathjs';

export interface FalsePositionResult {
	result: number;
	iter: number;
	iterations?: { x: number; y: number }[];
	error?: string;
}

export function falsePositionMethod(
	xStart: number,
	xEnd: number,
	errorFactor: number,
	func: string
): FalsePositionResult {
	const result: FalsePositionResult = { result: 0, iter: 0, iterations: [] };

	const calculateX1 = (xl: number, xr: number) => {
		const fr = evaluate(func, { x: xr });
		const fl = evaluate(func, { x: xl });
		return (xl * fr - xr * fl) / (fr - fl);
	};

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
	let xm = calculateX1(xl, xr);
	while (iter < MAX_ITER) {
		iter += 1;
		if (iter == MAX_ITER) {
			result.error = 'Max iteration reached';
			break;
		}

		xm = calculateX1(xl, xr);
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

// console.log(falsePositionMethod(1.5, 2.0, 0.000001, 'x^4 - 13'));
