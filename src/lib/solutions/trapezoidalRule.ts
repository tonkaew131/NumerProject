import { evaluate } from 'mathjs';

export interface TrapezoidalResult {
	result: number;
	fx: { start: number; end: number; [n: number]: { x: number; y: number } };
	error?: string;
}

export function trapezoidalRule(
	xStart: number,
	xEnd: number,
	func: string,
	n: number
): TrapezoidalResult {
	const result: TrapezoidalResult = { result: 0, fx: { start: 0, end: 0 } };

	const fx = (x: number) => {
		return evaluate(func, { x: x });
	};

	try {
		fx(xStart);
	} catch (error) {
		result.error = 'Invalid function';
		return result;
	}

	if (n < 1) {
		result.error = 'Invalid n';
		return result;
	}

	if (n > 1000) {
		result.error = 'n too large';
		return result;
	}

	const h = (xEnd - xStart) / n;
	let sumAll = 0;
	// from 1 to n - 1
	for (let i = 1; i <= n - 1; i++) {
		result.fx[i] = { x: xStart + i * h, y: fx(xStart + i * h) };
		sumAll += result.fx[i].y;
	}

	result.fx.start = fx(xStart);
	result.fx.end = fx(xEnd);

	const ans = (h / 2) * (result.fx.start + 2 * sumAll + result.fx.end);
	result.result = ans;

	return result;
}

console.log(trapezoidalRule(2, 8, '4x^5 - 3x^4 + x^3 - 6x + 2', 6));
