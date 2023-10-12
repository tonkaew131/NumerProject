import { abs, evaluate } from 'mathjs';

export interface OnePointIterationResult {
	result: number;
	iter: number;
	iterations?: { x: number; y: number; err: number }[];
	error?: string;
}

export function onePointIteration(
	xStart: number,
	errorFactor: number,
	func: string
): OnePointIterationResult {
	const result: OnePointIterationResult = { result: 0, iter: 0, iterations: [] };

	try {
		evaluate(func, { x: xStart });
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
			result.iterations.push({ x: x, y: evaluate(func, { x: x }), err: error });
		}
		x = evaluate(func, { x: x });

		error = abs((x - xold) / xold);
		if (error < errorFactor) {
			result.result = x;
			result.iter = iter;
			break;
		}

		xold = x;
	}

	return result;
}

// console.log(onePointIteration(-1, 0.000001, 'cos(x)'));
