import { copyArray } from '$lib/utils';

export interface JacobiIterationMethodResult {
	result: number[];
	iterations?: JacobiIterationData[];
	error?: string;
}

interface JacobiIterationData {
	iter: number;
	error: number[];
	x: number[];
}

export function jacobiIterationMethod(
	matrixA: number[][],
	arrayB: number[],
	initialX: number[],
	epsilon: number
): JacobiIterationMethodResult {
	const resultData: JacobiIterationMethodResult = {
		result: [],
		iterations: []
	};

	const n = matrixA.length;

	if (n != arrayB.length || n != initialX.length) {
		resultData.error = 'Invalid matrix';
		return resultData;
	}

	const arrayXNew = copyArray(initialX);
	let arrayXOld = Array(n).fill(0);

	const calculateError = (newValue: number, oldValue: number) => {
		return Math.abs((oldValue - newValue) / oldValue);
	};

	const isError = (epsilon: number) => {
		for (let i = 0; i < n; i++) {
			if (calculateError(arrayXNew[i], arrayXOld[i]) > epsilon) {
				return true;
			}
		}
		return false;
	};

	resultData.iterations?.push({
		iter: 0,
		error: Array(n).fill(Infinity),
		x: copyArray(arrayXNew)
	});

	let iter = 0;
	const MAX_ITERATION = 100;
	while (iter < MAX_ITERATION) {
		iter++;

		for (let i = 0; i < n; i++) {
			let sum = 0;
			for (let j = 0; j < n; j++) {
				if (i !== j) {
					sum += matrixA[i][j] * arrayXNew[j];
				}
			}
			arrayXNew[i] = (arrayB[i] - sum) / matrixA[i][i];
		}

		resultData.iterations?.push({
			iter,
			error: Array(n)
				.fill(0)
				.map((_, i) => calculateError(arrayXNew[i], arrayXOld[i])),
			x: copyArray(arrayXNew)
		});

		if (!isError(epsilon)) {
			break;
		}

		arrayXOld = copyArray(arrayXNew);
	}

	resultData.result = arrayXNew;

	return resultData;
}

// console.log(
// 	jacobiIterationMethod(
// 		[
// 			[5, 2, 0, 0],
// 			[2, 5, 2, 0],
// 			[0, 2, 5, 2],
// 			[0, 0, 2, 5]
// 		],
// 		[12, 17, 14, 7],
// 		[0, 0, 0, 0],
// 		0.000001
// 	)
// );
