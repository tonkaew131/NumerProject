import { get, writable } from 'svelte/store';

import modalStore from '$lib/solutions/solution-layout/solution-layout-modal-store';
import { createArray, createMatrix } from '$lib/utils';

import type { MatrixInversionResult } from './matrix-inversion';

interface inputData {
	matrixA: number[][];
	arrayB: number[];
	matrixSize: number;
}

const store = writable<{
	input: inputData;
	loading: boolean;
	result: MatrixInversionResult | null;
}>({
	input: {
		matrixA: createMatrix(3),
		arrayB: createArray(3),
		matrixSize: 3
	},
	loading: false,
	result: null
});
const { subscribe, set, update } = store;

const setLoading = (loading: boolean) => {
	update((value) => ({ ...value, loading }));
};

const setResult = (result: MatrixInversionResult) => {
	update((value) => ({ ...value, result }));
};

let timeSinceLastCalculate = 0;
const COOLDOWN_TIME = 5;
const fetchSolution = async () => {
	if (timeSinceLastCalculate == 0) timeSinceLastCalculate = Date.now();
	else if (Date.now() - timeSinceLastCalculate < COOLDOWN_TIME * 1000) {
		const timeLeft = COOLDOWN_TIME - (Date.now() - timeSinceLastCalculate) / 1000;
		modalStore.set(
			'Calculation Error!',
			`Please wait for ${COOLDOWN_TIME} seconds before calculating again (${timeLeft.toFixed(1)}s)`
		);
		return;
	}

	timeSinceLastCalculate = Date.now();
	setLoading(true);

	const res = await fetch('/api/solution/linear/inversion', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			matrixA: get(store).input.matrixA,
			arrayB: get(store).input.arrayB
		})
	});
	const jsonData = await res.json();

	setLoading(false);
	if (jsonData.error) {
		modalStore.set('Calculation Error!', jsonData.error.message);
		console.log(jsonData);

		return;
	}

	if (jsonData.warning) {
		modalStore.set('Calculation Warning!', jsonData.warning.message);
	}

	setResult(jsonData.data);
	console.log(get(store));

	// formatResultData();
	return;
};

const createMatrixInversionStore = { subscribe, set, update, fetchSolution };

export default createMatrixInversionStore;
