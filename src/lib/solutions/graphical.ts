import { abs, evaluate, floor, log, pow } from 'mathjs';

export interface GraphicalResult {
	result: number;
	iter: number;
	iterations?: { x: number; y: number }[];
	error?: string;
}

export function graphicalMethod(
	xStart: number,
	xEnd: number,
	errorFactor: number,
	func: string
): GraphicalResult {
	const result: GraphicalResult = { result: 0, iter: 0, iterations: [] };

	if (xStart >= xEnd) {
		result.error = 'xStart must be less than xEnd';
		return result;
	}

	const calculateStep = (xStart: number, xEnd: number) => {
		const step = log(xEnd - xStart, 10);
		if (step % 1 == 0) return Number(pow(10, step - 1));
		return Number(pow(10, floor(step)));
	};

	let step = calculateStep(xStart, xEnd);
	const MAX_ITER = 1000;
	let iter = 0;
	let x = xStart;
	let temp = 0;
	try {
		temp = evaluate(func, { x: xStart });
	} catch (error) {
		result.error = 'Invalid function';
		return result;
	}
	let newTemp;
	while (iter < MAX_ITER) {
		iter += 1;
		if (iter == MAX_ITER) {
			result.error = 'Max iteration reached';
			break;
		}

		// x here
		newTemp = evaluate(func, { x });

		if (result.iterations) result.iterations.push({ x: Number(x), y: newTemp });

		if (abs(newTemp) < errorFactor) {
			break;
		}
		// sign changed
		if (temp * newTemp < 0) {
			x -= step;
			step /= 10;

			newTemp = evaluate(func, { x });
		}

		if (x == xEnd) break;

		x += step;
		if (x > xEnd) {
			x = xEnd;
		}

		temp = newTemp;
	}

	result.result = x;
	result.iter = iter;

	return result;
}

// console.log(graphicalMethod(0, 10, 0.000001, 'x^2 - 7'));
