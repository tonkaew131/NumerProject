import { writable } from 'svelte/store';

import modalStore from '$lib/solutions/solution-layout/solution-layout-modal-store';
import { createArray, createMatrix } from '$lib/utils';

import type { MatrixInversionResult } from './matrix-inversion';

interface inputData {
	matrixA: number[][];
	arrayB: number[];
	matrixSize: number;
}

const { subscribe, set, update } = writable<
	MatrixInversionResult & {
		input: inputData;
		loading: boolean;
	}
>({
	input: {
		matrixA: createMatrix(3),
		arrayB: createArray(3),
		matrixSize: 3
	},
	loading: false,
	matrix: createMatrix(3),
	result: createArray(3)
});

const fetchSolution = () => {
	modalStore.set('Matrix Inversion', 'This is the Matrix Inversion solution');
	return;
};

const createMatrixInversionStore = { subscribe, set, update, fetchSolution };

export default createMatrixInversionStore;
