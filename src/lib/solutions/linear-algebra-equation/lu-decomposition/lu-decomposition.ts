import { createArray, createMatrix } from '$lib/utils';

export interface LUDecompositionResult {
	matrixL: number[][];
	matrixU: number[][];
	arrayY: number[];
	result: number[];
	error?: string;
}

export function luDecomposition(matrixA: number[][], arrayB: number[]): LUDecompositionResult {
	const resultData: LUDecompositionResult = {
		arrayY: [],
		matrixL: [],
		matrixU: [],
		result: []
	};

	const n = matrixA.length;

	if (n != arrayB.length) {
		resultData.error = 'Invalid matrix';
		return resultData;
	}

	const matrixL: number[][] = createMatrix(n);
	const matrixU: number[][] = createMatrix(n);

	for (let i = 0; i < n; i++) {
		for (let j = 0; j < n; j++) {
			matrixL[i][j] = 0;
			matrixU[i][j] = i == j ? 1 : 0;
		}
	}

	// Decomposition A -> LU
	let sum = 0;
	for (let i = 0; i < n; i++) {
		for (let j = 0; j < n; j++) {
			sum = matrixA[i][j];
			for (let k = 0; k < n; k++) {
				if (Math.min(i, j) == k) continue;
				sum -= matrixL[i][k] * matrixU[k][j];
			}

			// L
			if (i >= j) {
				matrixL[i][j] = sum / matrixU[Math.min(i, j)][Math.min(i, j)];
			}
			// U
			else {
				matrixU[i][j] = sum / matrixL[Math.min(i, j)][Math.min(i, j)];
			}
		}
	}

	resultData.matrixL = matrixL;
	resultData.matrixU = matrixU;

	// LY = B, find Y
	const arrayY: number[] = createArray(n);
	for (let i = 0; i < n; i++) {
		sum = arrayB[i];
		for (let j = 0; j < i; j++) {
			if (i == j) continue;
			sum -= matrixL[i][j] * arrayY[j];
		}
		arrayY[i] = sum / matrixL[i][i];
	}

	resultData.arrayY = arrayY;

	// Ux = Y, find x
	const arrayX: number[] = createArray(n);
	for (let i = n - 1; i >= 0; i--) {
		sum = arrayY[i];
		for (let j = n - 1; j > i; j--) {
			if (i == j) continue;
			sum -= matrixU[i][j] * arrayX[j];
		}
		arrayX[i] = sum / matrixU[i][i];
	}

	resultData.result = arrayX;

	return resultData;
}

// console.log(
// 	luDecomposition(
// 		[
// 			[-2, 3, 1],
// 			[3, 4, -5],
// 			[1, -2, 1]
// 		],
// 		[9, 0, -4]
// 	)
// );
