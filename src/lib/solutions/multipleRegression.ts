export interface MultipleRegressionResult {
	result: number;
	matrixA: number[][];
	matrixB: number[];
	a: { [key: number]: number };
	error?: string;
}

export function multipleRegression(
	xPointsArray: number[][],
	yPoints: number[],
	xValue: number[]
): MultipleRegressionResult {
	const result: MultipleRegressionResult = { result: 0, matrixA: [], matrixB: [], a: {} };

	// Number of xk points
	const k = xPointsArray.length;
	if (xValue.length != k) {
		result.error = `xValue has different number of points`;
		return result;
	}

	if (k >= 20) {
		result.error = 'k limit is 20';
		return result;
	}

	// Number of points in each data
	const nSize = yPoints.length;
	for (let i = 0; i < k; i++) {
		if (xPointsArray[i].length != nSize) {
			result.error = `x${i} has different number of points`;
			return result;
		}
	}

	const xixjSumCache: { [key: string]: number } = {};
	const getXiXjSumCache = (i: number, j: number) => {
		const key = `${i}-${j}`;
		const key2 = `${j}-${i}`;
		if (key in xixjSumCache) return xixjSumCache[key];
		if (key2 in xixjSumCache) return xixjSumCache[key2];

		let totalSum = 0;
		for (let k = 0; k < nSize; k++) {
			totalSum += (i != 0 ? xPointsArray[i - 1][k] : 1) * (j != 0 ? xPointsArray[j - 1][k] : 1);
		}

		xixjSumCache[key] = totalSum;
		xixjSumCache[key2] = totalSum;
		return totalSum;
	};

	// Matrix size k+1 x k+1
	const matrix: number[][] = [];
	for (let i = 0; i < k + 1; i++) {
		matrix[i] = [];
		result.matrixA[i] = [];

		for (let j = 0; j < k + 1; j++) {
			// n
			if (i == 0 && j == 0) {
				matrix[i][j] = yPoints.length;
				result.matrixA[i][j] = yPoints.length;
			}

			matrix[i][j] = getXiXjSumCache(i, j);
			result.matrixA[i][j] = getXiXjSumCache(i, j);
		}

		matrix[i][k + 1] = 0;
		result.matrixB[i] = 0;
		for (let j = 0; j < nSize; j++) {
			matrix[i][k + 1] += yPoints[j] * (i != 0 ? xPointsArray[i - 1][j] : 1);
			result.matrixB[i] += yPoints[j] * (i != 0 ? xPointsArray[i - 1][j] : 1);
		}
	}

	const matrixRREF = rref(matrix);
	if (matrixRREF === undefined) {
		result.error = 'Cannot solve for reduced row echelon form';
		return result;
	}

	let resultSum = 0;
	for (let i = 0; i < k + 1; i++) {
		result.a[i] = matrixRREF[i][k + 1];
		resultSum += result.a[i] * (i != 0 ? xValue[i - 1] : 1);
	}

	result.result = resultSum;

	return result;
}

console.log(
	multipleRegression(
		[
			[1, 0, 2, 3, 4, 2, 1],
			[0, 1, 4, 2, 1, 3, 6],
			[1, 3, 1, 2, 5, 3, 4]
		],
		[4, -5, -6, 0, -1, -7, -20],
		[0, 0, 0]
	)
);

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
