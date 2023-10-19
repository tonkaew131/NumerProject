import { evaluate } from 'mathjs';

export interface SimpsonResult {
	result: number;
	fx: { start: number; end: number; [n: number]: { x: number; y: number } };
	error?: string;
}

export function simpsonRule(xStart: number, xEnd: number, func: string, n: number) {
	const result: SimpsonResult = { result: 0, fx: { start: 0, end: 0 } };

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

	if (n > 100) {
		result.error = 'n too large';
		return result;
	}

	if (func.trim() == '') {
		result.error = 'Invalid function';
		return result;
	}

	const h = (xEnd - xStart) / (2 * n);

	let totalSum = 0;

	for (let i = 1; i <= n * 2 - 1; i++) {
		if (i % 2 == 0) {
			result.fx[i] = { x: xStart + i * h, y: fx(xStart + i * h) };
			totalSum += 2 * result.fx[i].y;
		} else {
			result.fx[i] = { x: xStart + i * h, y: fx(xStart + i * h) };
			totalSum += 4 * result.fx[i].y;
		}
	}

	result.fx.start = fx(xStart);
	result.fx.end = fx(xEnd);
	totalSum += result.fx.start;
	totalSum += result.fx.end;

	const ans = (h / 3) * totalSum;
	result.result = ans;

	return result;
}

console.log({
	single: simpsonRule(-1, 2, 'x^7+2x^3-1', 1),
	n2: simpsonRule(-1, 2, 'x^7+2x^3-1', 2),
	n4: simpsonRule(-1, 2, 'x^7+2x^3-1', 4),
	n6: simpsonRule(-1, 2, 'x^7+2x^3-1', 6)
});
