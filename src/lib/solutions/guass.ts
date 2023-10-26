import { det } from 'mathjs';

import { copyMatrix } from '$lib/utils';

export interface GuassType {
	iterations: GuassIterationType[];
	answers?: number[];
	matrix?: number[][];
	error?: string;
}

export interface GuassIterationType {
	type: 'forw' | 'swap' | 'back';
	i: number;
	j: number;
	factor?: number;
	value?: number;
	sumIdx?: number[];
	matrix?: number[][];
}

export function guassEliminationMethods(matrixA: number[][], matrixB: number[]) {
	const MATRIX_SIZE = matrixA.length;
	const matrix: number[][] = [];

	if (MATRIX_SIZE !== matrixB.length) return { error: 'Matrix A and B must have the same size' };

	if (det(matrixA) == 0) {
		return {
			error: 'Matrix A is singular'
		};
	}

	for (let i = 0; i < MATRIX_SIZE; i++) {
		matrix[i] = [];
		for (let j = 0; j < MATRIX_SIZE; j++) {
			matrix[i][j] = matrixA[i][j];
		}
		matrix[i][MATRIX_SIZE] = matrixB[i];
	}

	const result: GuassType = {
		iterations: []
	};

	// Partial pivoting
	for (let i = 0; i < MATRIX_SIZE; i++) {
		// Find the pivot element for the current row.
		let pivotRow = i;
		for (let j = i + 1; j < MATRIX_SIZE; j++) {
			if (Math.abs(matrix[j][i]) > Math.abs(matrix[pivotRow][i])) {
				pivotRow = j;
			}
		}

		// Swap the current row with the pivot row.
		if (pivotRow !== i) {
			const temp = matrix[i];
			matrix[i] = matrix[pivotRow];
			matrix[pivotRow] = temp;

			result.iterations.push({
				i: i,
				j: pivotRow,
				type: 'swap',
				matrix: copyMatrix(matrix)
			});
		}

		// Forward elimination
		for (let j = 0; j < i; j++) {
			if (matrix[i][j] == 0) continue;
			const factor = matrix[j][j] / matrix[i][j];
			for (let k = 0; k < MATRIX_SIZE + 1; k++) {
				matrix[i][k] = matrix[i][k] * factor - matrix[j][k];
			}

			result.iterations.push({
				type: 'forw',
				i: i,
				j: j,
				factor: factor,
				matrix: copyMatrix(matrix)
			});
		}
	}

	const answers = new Array(MATRIX_SIZE);

	// Backward substitution
	for (let i = MATRIX_SIZE - 1; i >= 0; i--) {
		if (matrix[i][i] == 0) continue;
		let sum = matrix[i][MATRIX_SIZE];

		const sumIdx = [];
		for (let j = 0; j < MATRIX_SIZE - i - 1; j++) {
			const k = MATRIX_SIZE - j - 1;
			sumIdx.push(k);
			sum -= matrix[i][k] * answers[k];
		}

		result.iterations.push({
			type: 'back',
			i: i,
			j: i,
			value: sum / matrix[i][i],
			sumIdx: sumIdx
		});
		answers[i] = sum / matrix[i][i];

		if (isNaN(answers[i])) return { error: 'Linear equation system is inconsistent' };
	}

	const matrixNoAns = new Array(MATRIX_SIZE);
	for (let i = 0; i < MATRIX_SIZE; i++) {
		matrixNoAns[i] = [];
		for (let j = 0; j < MATRIX_SIZE; j++) {
			matrixNoAns[i][j] = matrix[i][j];
		}
	}

	result.matrix = matrixNoAns;
	result.answers = answers;
	return result;
}

// console.log(
// 	guassEliminationMethods(
// 		[
// 			[16, 4, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
// 			[0, 0, 0, 16, 4, 1, 0, 0, 0, 0, 0, 0],
// 			[0, 0, 0, 36, 6, 1, 0, 0, 0, 0, 0, 0],
// 			[0, 0, 0, 0, 0, 0, 36, 6, 1, 0, 0, 0],
// 			[0, 0, 0, 0, 0, 0, 64, 8, 1, 0, 0, 0],
// 			[0, 0, 0, 0, 0, 0, 0, 0, 0, 64, 8, 1],
// 			[8, 1, 0, -8, -1, 0, 0, 0, 0, 0, 0, 0],
// 			[0, 0, 0, 12, 1, 0, -12, -1, 0, 0, 0, 0],
// 			[0, 0, 0, 0, 0, 0, 16, 1, 0, -16, -1, 0],
// 			[4, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
// 			[0, 0, 0, 0, 0, 0, 0, 0, 0, 100, 10, 1],
// 			[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
// 		],
// 		[8, 8, 10.5, 10.5, 39.5, 39.5, 0, 0, 0, 9.5, 72.5, 0]
// 	)
// );
