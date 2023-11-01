import { inv, multiply } from 'mathjs';

export interface MatrixInversionResult {
	matrix: number[][];
	result: number[];
	error?: string;
}

export function matrixInversion(matrixA: number[][], arrayB: number[]): MatrixInversionResult {
	const resultData: MatrixInversionResult = {
		matrix: [],
		result: []
	};

	const n = matrixA.length;

	if (n != arrayB.length) {
		resultData.error = 'Invalid matrix';
		return resultData;
	}

	resultData.matrix = inv(matrixA);
	resultData.result = multiply(resultData.matrix, arrayB);

	return resultData;
}
