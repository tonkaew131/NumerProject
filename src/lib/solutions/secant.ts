import { evaluate } from 'mathjs';

export interface SecantResult {
	result: number;
	iter: number;
	iterations?: { x: number; y: number }[];
	error?: string;
}

export function secantMethod(
	x0: number,
	x1: number,
	errorFactor: number,
	func: string
): SecantResult {
	const result: SecantResult = { result: 0, iter: 0, iterations: [] };

	if (!func || func.trim().length == 0) {
		result.error = 'Invalid function';
		return result;
	}

	const f1x = '';
	try {
		evaluate(func, { x: x0 });
	} catch (error) {
		result.error = 'Invalid function';
		return result;
	}

	const calcuateXn = (xn2: number, xn1: number) => {
		const fxn2 = evaluate(func, { x: xn2 });
		const fxn1 = evaluate(func, { x: xn1 });

		return xn2 - (fxn2 * (xn1 - xn2)) / (fxn1 - fxn2);
	};

	let iter = 0;
	const MAX_ITER = 100;
	let xn2 = x0;
	let xn1 = x1;
	let x = calcuateXn(xn2, xn1);
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
		x = calcuateXn(xn2, xn1);

		error = Math.abs((x - xn1) / xn1);
		if (error < errorFactor) {
			result.result = x;
			result.iter = iter;
			break;
		}

		xn2 = xn1;
		xn1 = x;
	}

	return result;
}

console.log(secantMethod(1, 1.5, 0.000001, 'x^2 - 7'));
