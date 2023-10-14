import { derivative, evaluate } from 'mathjs';

export interface NewtonRaphsonResult {
	result: number;
	iter: number;
	iterations?: { x: number; y: number }[];
	error?: string;
}

export function newtonRaphson(
	xStart: number,
	errorFactor: number,
	func: string
): NewtonRaphsonResult {
	const result: NewtonRaphsonResult = { result: 0, iter: 0, iterations: [] };

	if (!func || func.trim().length == 0) {
		result.error = 'Invalid function';
		return result;
	}

	let f1x = '';
	try {
		f1x = derivative(func, 'x').toString();
		evaluate(func, { x: xStart });
		evaluate(f1x, { x: xStart });
	} catch (error) {
		result.error = 'Invalid function';
		return result;
	}

	let iter = 0;
	const MAX_ITER = 100;
	let x = xStart;
	let xold = x * 100;
	let error = 0;
	while (iter < MAX_ITER) {
		iter += 1;
		if (iter == MAX_ITER) {
			result.error = 'Max iteration reached';
			break;
		}

		if (result.iterations) {
			result.iterations.push({ x: x, y: evaluate(func, { x: x }) });
		}
		x = x - evaluate(func, { x: x }) / evaluate(f1x, { x: x });

		error = Math.abs((x - xold) / xold);
		if (error < errorFactor) {
			result.result = x;
			result.iter = iter;
			break;
		}

		xold = x;
	}

	return result;
}

// console.log(newtonRaphson(2, 0.000001, 'x^2 - 7'));
