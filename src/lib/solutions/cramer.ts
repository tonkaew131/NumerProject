import { det } from 'mathjs';

import { copyMatrix } from '$lib/utils';

export interface CramerResult {
	matrixAi: number[][][];
	detAi: number[];
	detA: number;
	result: number[];
	error?: string;
}

export function cramerRule(matrixA: number[][], arrayB: number[]): CramerResult {
	const result: CramerResult = { result: [], matrixAi: [], detAi: [], detA: 0 };

	const n = matrixA.length;

	if (n != arrayB.length) {
		result.error = 'Invalid matrix';
		return result;
	}

	const detA = det(matrixA);
	result.detA = detA;

	if (detA == 0) {
		result.error = 'Determinant is zero';
		return result;
	}

	const matrixAList: number[][][] = [];

	for (let i = 0; i < n; i++) {
		const newMatrixA = copyMatrix(matrixA);
		for (let j = 0; j < n; j++) {
			newMatrixA[j][i] = arrayB[j];
		}
		matrixAList.push(newMatrixA);
	}

	result.matrixAi = matrixAList;

	for (let i = 0; i < n; i++) {
		const detAi = det(matrixAList[i]);
		result.detAi.push(detAi);
		result.result.push(detAi / detA);
	}

	return result;
}

console.log(
	cramerRule(
		[
			[-2, 3, 1],
			[3, 4, -5],
			[1, -2, 1]
		],
		[9, 0, -4]
	)
);
