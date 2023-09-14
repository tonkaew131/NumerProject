import { copyMatrix } from '$lib/utils';

export interface GuassType {
	iterations: GuassIterationType[];
	backIterations?: GuassIterationType[];
	answers?: number[];
	matrix?: number[][];
}

export interface GuassIterationType {
	type: 'forward_elimination' | 'backward_substitution';
	i: number;
	j: number;
	factor?: number;
	value?: number;
	sumIdx?: number[];
	matrix?: number[][];
	matrixk_1?: number[][];
}

export function guassEliminationMethods(matrixA: number[][], matrixB: number[]) {
	const MATRIX_SIZE = matrixA.length;
	const matrix: number[][] = [];

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

	// Forward elimination
	for (let i = 1; i < MATRIX_SIZE; i++) {
		for (let j = 0; j < i; j++) {
			const factor = matrix[j][j] / matrix[i][j];

			const data: GuassIterationType = {
				type: 'forward_elimination',
				i: i,
				j: j,
				factor: factor,
				matrixk_1: copyMatrix(matrix)
			};

			for (let k = 0; k < MATRIX_SIZE + 1; k++) {
				matrix[i][k] = matrix[i][k] * factor - matrix[j][k];
			}

			data['matrix'] = copyMatrix(matrix);
			result.iterations.push(data);
		}
	}

	const answers = new Array(MATRIX_SIZE);

	// Backward substitution
	const backSubstitution: GuassIterationType[] = [];
	for (let i = MATRIX_SIZE - 1; i >= 0; i--) {
		let sum = matrix[i][MATRIX_SIZE];

		const sumIdx = [];
		for (let j = 0; j < MATRIX_SIZE - i - 1; j++) {
			const k = MATRIX_SIZE - j - 1;
			sumIdx.push(k);
			sum -= matrix[i][k] * answers[k];
		}

		backSubstitution.push({
			type: 'backward_substitution',
			i: i,
			j: i,
			value: sum / matrix[i][i],
			sumIdx: sumIdx
		});
		answers[i] = sum / matrix[i][i];
	}

	const matrixNoAns = new Array(MATRIX_SIZE);
	for (let i = 0; i < MATRIX_SIZE; i++) {
		matrixNoAns[i] = [];
		for (let j = 0; j < MATRIX_SIZE; j++) {
			matrixNoAns[i][j] = matrix[i][j];
		}
	}

	result.backIterations = backSubstitution;
	result.matrix = matrixNoAns;
	result.answers = answers;
	return result;
}
