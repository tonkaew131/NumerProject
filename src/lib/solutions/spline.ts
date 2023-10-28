export interface SplineInterpolationResult {
	result: number;
	resultAt: number;
	funcs: {
		[key: number]: {
			// for quadratic and cubic
			a?: number;
			b?: number;
			c?: number;
			d?: number;
			// for linear
			fx1?: number;
			slope?: number;
			offset?: number;
		};
	};
	error?: string;
}

export function splineInterpolation(
	points: {
		x: number;
		y: number;
	}[],
	xValue: number,
	mode: 'linear' | 'quadratic' | 'cubic'
): SplineInterpolationResult {
	// n + 1 points
	// n intervals
	const n = points.length - 1;

	// 1, 2, 3, ..., n
	const f: {
		[key: number]: {
			// for quadratic and cubic
			a?: number;
			b?: number;
			c?: number;
			d?: number;
			// for linear
			fx1?: number;
			slope?: number;
			offset?: number;
		};
	} = {};

	let result = -1;
	let resultAt = -1;

	if (mode === 'linear') {
		for (let i = 1; i <= n; i++) {
			// fi = f(xi-1) + ((f(xi) - f(xi-1))/(xi - xi-1))(x - xi-1)
			const fx1 = points[i - 1].y;
			const slope = (points[i].y - points[i - 1].y) / (points[i].x - points[i - 1].x);
			const offset = points[i - 1].x;
			f[i] = {
				fx1,
				slope,
				offset
			};
			if (xValue >= points[i - 1].x && xValue <= points[i].x) {
				resultAt = i;
				result = fx1 + slope * (xValue - offset);
			}
		}
	} else if (mode == 'quadratic') {
		const matrixA = [];
		const matrixB = [];
		// value of interior knots (n - 1 knots)
		// each knots have 2 functions
		for (let i = 1; i < n; i++) {
			const rowMatrix: number[] = [];
			const x = points[i].x;
			const y = points[i].y;

			for (let j = 0; j < 3 * (i - 1); j++) rowMatrix.push(0);
			rowMatrix.push(x * x);
			rowMatrix.push(x);
			rowMatrix.push(1);
			for (let j = 0; j < 3 * (n - i); j++) rowMatrix.push(0);
			matrixA.push(rowMatrix);
			matrixB.push(y);

			const rowMatrix2: number[] = [];
			for (let j = 0; j < 3 * (i - 1) + 3; j++) rowMatrix2.push(0);
			rowMatrix2.push(x * x);
			rowMatrix2.push(x);
			rowMatrix2.push(1);
			for (let j = 0; j < 3 * (n - i - 1); j++) rowMatrix2.push(0);
			matrixA.push(rowMatrix2);
			matrixB.push(y);
		}

		// value of boundary knots (2 knots)
		// each knots have 1 function
		{
			const rowMatrix: number[] = [];
			const x = points[0].x;
			const y = points[0].y;
			rowMatrix.push(x * x);
			rowMatrix.push(x);
			rowMatrix.push(1);
			for (let j = 0; j < 3 * (n - 1); j++) rowMatrix.push(0);
			matrixA.push(rowMatrix);
			matrixB.push(y);

			const rowMatrix2: number[] = [];
			for (let j = 0; j < 3 * (n - 1); j++) rowMatrix2.push(0);
			const x2 = points[n].x;
			const y2 = points[n].y;
			rowMatrix2.push(x2 * x2);
			rowMatrix2.push(x2);
			rowMatrix2.push(1);
			matrixA.push(rowMatrix2);
			matrixB.push(y2);
		}

		// first derivative of interior knots (n - 1 knots)
		for (let i = 1; i < n; i++) {
			const rowMatrix: number[] = [];
			const x = points[i].x;

			for (let j = 0; j < 3 * (i - 1); j++) rowMatrix.push(0);
			rowMatrix.push(2 * x);
			rowMatrix.push(1);
			rowMatrix.push(0);
			rowMatrix.push(-2 * x);
			rowMatrix.push(-1);
			rowMatrix.push(0);
			for (let j = 0; j < 3 * (n - i - 1); j++) rowMatrix.push(0);
			matrixA.push(rowMatrix);
			matrixB.push(0);
		}

		// free equation :D
		{
			const rowMatrix: number[] = [];
			rowMatrix.push(1);
			rowMatrix.push(0);
			rowMatrix.push(0);
			for (let j = 0; j < 3 * (n - 1); j++) rowMatrix.push(0);
			matrixA.push(rowMatrix);
			matrixB.push(0);
		}

		for (let i = 0; i < matrixA.length; i++) {
			matrixA[i].push(matrixB[i]);
		}

		const matrixRREF = rref(matrixA);
		if (matrixRREF === undefined) {
			return {
				funcs: {},
				result: -1,
				resultAt: -1,
				error: 'Matrix is undefined'
			};
		}

		const answers = new Array(matrixRREF.length);
		for (let i = 0; i < matrixRREF.length; i++) {
			answers[i] = matrixRREF[i][matrixRREF[i].length - 1];
		}

		for (let i = 0; i < n; i++) {
			const a = answers[i * 3];
			const b = answers[i * 3 + 1];
			const c = answers[i * 3 + 2];
			f[i + 1] = {
				a,
				b,
				c
			};
			if (xValue >= points[i].x && xValue <= points[i + 1].x) {
				resultAt = i;
				result = a * xValue * xValue + b * xValue + c;
			}
		}
	} else if (mode == 'cubic') {
		const matrixA = [];
		const matrixB = [];
		// value of interior knots (n - 1 knots)
		// each knots have 2 functions
		for (let i = 1; i < n; i++) {
			const rowMatrix: number[] = [];
			const x = points[i].x;
			const y = points[i].y;

			for (let j = 0; j < 4 * (i - 1); j++) rowMatrix.push(0);
			rowMatrix.push(x * x * x);
			rowMatrix.push(x * x);
			rowMatrix.push(x);
			rowMatrix.push(1);
			for (let j = 0; j < 4 * (n - i); j++) rowMatrix.push(0);
			matrixA.push(rowMatrix);
			matrixB.push(y);

			const rowMatrix2: number[] = [];
			for (let j = 0; j < 4 * (i - 1) + 4; j++) rowMatrix2.push(0);
			rowMatrix2.push(x * x * x);
			rowMatrix2.push(x * x);
			rowMatrix2.push(x);
			rowMatrix2.push(1);
			for (let j = 0; j < 4 * (n - i - 1); j++) rowMatrix2.push(0);
			matrixA.push(rowMatrix2);
			matrixB.push(y);
		}

		// value of end knots (2 knots)
		{
			const rowMatrix: number[] = [];
			const x = points[0].x;
			const y = points[0].y;
			rowMatrix.push(x * x * x);
			rowMatrix.push(x * x);
			rowMatrix.push(x);
			rowMatrix.push(1);
			for (let j = 0; j < 4 * (n - 1); j++) rowMatrix.push(0);
			matrixA.push(rowMatrix);
			matrixB.push(y);

			const rowMatrix2: number[] = [];
			for (let j = 0; j < 4 * (n - 1); j++) rowMatrix2.push(0);
			const x2 = points[n].x;
			const y2 = points[n].y;
			rowMatrix2.push(x2 * x2 * x2);
			rowMatrix2.push(x2 * x2);
			rowMatrix2.push(x2);
			rowMatrix2.push(1);
			matrixA.push(rowMatrix2);
			matrixB.push(y2);
		}

		// first derivative of interior knots (n - 1 knots)
		for (let i = 1; i < n; i++) {
			const rowMatrix: number[] = [];
			const x = points[i].x;

			for (let j = 0; j < 4 * (i - 1); j++) rowMatrix.push(0);
			rowMatrix.push(3 * x * x);
			rowMatrix.push(2 * x);
			rowMatrix.push(1);
			rowMatrix.push(0);
			rowMatrix.push(-3 * x * x);
			rowMatrix.push(-2 * x);
			rowMatrix.push(-1);
			rowMatrix.push(0);
			for (let j = 0; j < 4 * (n - i - 1); j++) rowMatrix.push(0);
			matrixA.push(rowMatrix);
			matrixB.push(0);
		}

		// second derivative of interior knots (n - 1 knots)
		for (let i = 1; i < n; i++) {
			const rowMatrix: number[] = [];
			const x = points[i].x;

			for (let j = 0; j < 4 * (i - 1); j++) rowMatrix.push(0);
			rowMatrix.push(6 * x);
			rowMatrix.push(2);
			rowMatrix.push(0);
			rowMatrix.push(0);
			rowMatrix.push(-6 * x);
			rowMatrix.push(-2);
			rowMatrix.push(0);
			rowMatrix.push(0);
			for (let j = 0; j < 4 * (n - i - 1); j++) rowMatrix.push(0);
			matrixA.push(rowMatrix);
			matrixB.push(0);
		}

		// second derivative of end knots equals zero (2 knots)
		{
			const rowMatrix: number[] = [];
			rowMatrix.push(6 * points[0].x);
			rowMatrix.push(2);
			rowMatrix.push(0);
			rowMatrix.push(0);
			for (let j = 0; j < 4 * (n - 1); j++) rowMatrix.push(0);
			matrixA.push(rowMatrix);
			matrixB.push(0);

			const rowMatrix2: number[] = [];
			for (let j = 0; j < 4 * (n - 1); j++) rowMatrix2.push(0);
			rowMatrix2.push(6 * points[n].x);
			rowMatrix2.push(2);
			rowMatrix2.push(0);
			rowMatrix2.push(0);
			matrixA.push(rowMatrix2);
			matrixB.push(0);
		}

		for (let i = 0; i < matrixA.length; i++) {
			matrixA[i].push(matrixB[i]);
		}

		const matrixRREF = rref(matrixA);
		if (matrixRREF === undefined) {
			return {
				funcs: {},
				result: -1,
				resultAt: -1,
				error: 'Matrix is undefined'
			};
		}

		const answers = new Array(matrixRREF.length);
		for (let i = 0; i < matrixRREF.length; i++) {
			answers[i] = matrixRREF[i][matrixRREF[i].length - 1];
		}

		for (let i = 0; i < n; i++) {
			const a = answers[i * 4];
			const b = answers[i * 4 + 1];
			const c = answers[i * 4 + 2];
			const d = answers[i * 4 + 3];
			f[i + 1] = {
				a,
				b,
				c,
				d
			};
			if (xValue >= points[i].x && xValue <= points[i + 1].x) {
				resultAt = i;
				result = a * xValue * xValue * xValue + b * xValue * xValue + c * xValue + d;
			}
		}
	} else {
		return {
			funcs: {},
			result: -1,
			resultAt: -1,
			error: 'Invalid mode!'
		};
	}

	return {
		result,
		resultAt,
		funcs: f
	};
}

// console.log({
// 	cubic: splineInterpolation(
// 		[
// 			{ x: 2, y: 9.5 },
// 			{ x: 4, y: 8 },
// 			{ x: 6, y: 10.5 },
// 			{ x: 8, y: 39.5 },
// 			{ x: 10, y: 72.5 }
// 		],
// 		4.5,
// 		'cubic'
// 	),
// 	quadratic: splineInterpolation(
// 		[
// 			{ x: 2, y: 9.5 },
// 			{ x: 4, y: 8 },
// 			{ x: 6, y: 10.5 },
// 			{ x: 8, y: 39.5 },
// 			{ x: 10, y: 72.5 }
// 		],
// 		4.5,
// 		'quadratic'
// 	),
// 	linear: splineInterpolation(
// 		[
// 			{ x: 2, y: 9.5 },
// 			{ x: 4, y: 8 },
// 			{ x: 6, y: 10.5 },
// 			{ x: 8, y: 39.5 },
// 			{ x: 10, y: 72.5 }
// 		],
// 		4.5,
// 		'linear'
// 	)
// });

// https://rosettacode.org/wiki/Reduced_row_echelon_form
// https://github.com/Simsso/Online-Tools/blob/master/src/page/logic/cubic-spline-interpolation.js
function rref(mat: number[][]) {
	let lead = 0;
	for (let r = 0; r < mat.length; r++) {
		if (mat[0].length <= lead) {
			return;
		}
		let i = r;
		while (mat[i][lead] == 0) {
			i++;
			if (mat.length == i) {
				i = r;
				lead++;
				if (mat[0].length == lead) {
					return;
				}
			}
		}

		const tmp = mat[i];
		mat[i] = mat[r];
		mat[r] = tmp;

		let val = mat[r][lead];
		for (let j = 0; j < mat[0].length; j++) {
			mat[r][j] = mat[r][j] / val;
		}

		for (let i = 0; i < mat.length; i++) {
			if (i == r) continue;
			val = mat[i][lead];
			for (let j = 0; j < mat[0].length; j++) {
				mat[i][j] = mat[i][j] - val * mat[r][j];
			}
		}
		lead++;
	}
	return mat;
}
