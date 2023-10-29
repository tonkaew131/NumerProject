import { copyMatrix } from '$lib/utils';

export interface GuassJordanType {
	iterations: RowOperationType[];
	answers?: number[];
	matrix?: number[][];
	error?: string;
}

export interface RowOperationType {
	swap?: {
		i: number;
		j: number;
	};
	mult?: {
		i: number;
		fac: number;
	};
	elim?: {
		i: number;
		j: number;
		fac: number;
	};
	matrix: number[][];
}

export function guassJordanMethod(matrixA: number[][], arrayB: number[]): GuassJordanType {
	const result: GuassJordanType = {
		iterations: []
	};

	if (matrixA.length !== arrayB.length) {
		result.error = 'Matrix A and B must have the same size';
		return result;
	}

	// Create combined matrix
	const mat = copyMatrix(matrixA);
	for (let i = 0; i < mat.length; i++) {
		mat[i].push(arrayB[i]);
	}

	let lead = 0;
	for (let r = 0; r < mat.length; r++) {
		if (mat[0].length <= lead) {
			result.error = 'Matrix is unsolvable';
			return result;
		}

		let i = r;
		// Find the pivot element for the current row.
		while (mat[i][lead] == 0) {
			i++;
			if (mat.length == i) {
				i = r;
				lead++;
				if (mat[0].length == lead) {
					result.error = 'Matrix is unsolvable';
					return result;
				}
			}
		}

		if (i != r) {
			const iter: RowOperationType = {
				swap: {
					i: r,
					j: i
				},
				matrix: []
			};

			const tmp = mat[i];
			mat[i] = mat[r];
			mat[r] = tmp;

			iter.matrix = copyMatrix(mat);
			result.iterations.push(iter);
		}

		let val = mat[r][lead];
		const iter: RowOperationType = {
			mult: {
				i: r,
				fac: val
			},
			matrix: []
		};
		for (let j = 0; j < mat[0].length; j++) {
			mat[r][j] = mat[r][j] / val;
		}
		iter.matrix = copyMatrix(mat);
		result.iterations.push(iter);

		for (let i = 0; i < mat.length; i++) {
			if (i == r) continue;
			val = mat[i][lead];

			const iter: RowOperationType = {
				elim: {
					i: i,
					j: r,
					fac: val
				},
				matrix: []
			};

			for (let j = 0; j < mat[0].length; j++) {
				mat[i][j] = mat[i][j] - val * mat[r][j];
			}
			iter.matrix = copyMatrix(mat);
			result.iterations.push(iter);
		}
		lead++;
	}

	const answers = new Array(mat.length);
	for (let i = 0; i < mat.length; i++) {
		answers[i] = mat[i][mat[i].length - 1];
	}

	result.answers = answers;
	result.matrix = mat;

	return result;
}

// console.log(
// 	guassJordanMethod(
// 		[
// 			[-2, 3, 1],
// 			[3, 4, -5],
// 			[1, -2, 1]
// 		],
// 		[9, 0, -4]
// 	)
// );
