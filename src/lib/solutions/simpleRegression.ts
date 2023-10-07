export interface SimpleRegressionResult {
	result: number;
	matrixA: number[][];
	matrixB: number[];
	a: { [key: number]: number };
	error?: string;
}

export function simpleRegression(
	points: {
		x: number;
		y: number;
	}[],
	xValue: number,
	mOrder: number
): SimpleRegressionResult {
	const result: SimpleRegressionResult = { result: 0, matrixA: [], matrixB: [], a: {} };

	if (mOrder < 1) {
		result.error = 'm order must be at least 1';
		return result;
	}

	if (mOrder >= 20) {
		result.error = 'm order limit is 20';
		return result;
	}

	const xPowerCache: { [key: number]: number } = {};
	const getXPower = (power: number) => {
		if (Object.keys(xPowerCache).includes(String(power))) return xPowerCache[power];

		let totalSum = 0;
		for (let i = 0; i < points.length; i++) {
			totalSum += Math.pow(points[i].x, power);
		}

		xPowerCache[power] = totalSum;
		return totalSum;
	};

	// matrix size m+1 x m+1
	const matrix: number[][] = [];
	for (let i = 0; i < mOrder + 1; i++) {
		matrix[i] = [];
		result.matrixA[i] = [];

		for (let j = 0; j < mOrder + 1; j++) {
			// n
			if (i == 0 && j == 0) {
				matrix[i][j] = points.length;
				result.matrixA[i][j] = points.length;
			}

			matrix[i][j] = getXPower(i + j);
			result.matrixA[i][j] = getXPower(i + j);
		}

		matrix[i][mOrder + 1] = 0;
		result.matrixB[i] = 0;
		for (let j = 0; j < points.length; j++) {
			matrix[i][mOrder + 1] += points[j].y * Math.pow(points[j].x, i);
			result.matrixB[i] += points[j].y * Math.pow(points[j].x, i);
		}
	}

	const matrixRREF = rref(matrix);
	if (matrixRREF === undefined) {
		result.error = 'Cannot solve for reduced row echelon form';
		return result;
	}

	let resultSum = 0;
	for (let i = 0; i < mOrder + 1; i++) {
		result.a[i] = matrixRREF[i][mOrder + 1];
		resultSum += result.a[i] * Math.pow(xValue, i);
	}

	result.result = resultSum;

	return result;
}

// console.log({
// 	linear: simpleRegression(
// 		[
// 			{ x: 10, y: 5 },
// 			{ x: 15, y: 9 },
// 			{ x: 20, y: 15 },
// 			{ x: 30, y: 18 },
// 			{ x: 40, y: 22 },
// 			{ x: 50, y: 30 },
// 			{ x: 60, y: 35 },
// 			{ x: 70, y: 38 },
// 			{ x: 80, y: 43 }
// 		],
// 		65,
// 		1
// 	),
// 	quadratic: simpleRegression(
// 		[
// 			{ x: 10, y: 5 },
// 			{ x: 15, y: 9 },
// 			{ x: 20, y: 15 },
// 			{ x: 30, y: 18 },
// 			{ x: 40, y: 22 },
// 			{ x: 50, y: 30 },
// 			{ x: 60, y: 35 },
// 			{ x: 70, y: 38 },
// 			{ x: 80, y: 43 }
// 		],
// 		65,
// 		2
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
