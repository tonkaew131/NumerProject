<script lang="ts">
	import LinearAlgebraInput from '$lib/components/linearAlgebraInput.svelte';

	const createMatrix = (matrixSize: number) => {
		const matrix = new Array(Number(matrixSize));
		for (let i = 0; i < matrixSize; i++) {
			matrix[i] = new Array(Number(matrixSize));
		}
		return matrix;
	};

	const createArray = (matrixSize: number) => {
		const array = new Array(Number(matrixSize));
		return array;
	};

	let matrixSize: number = 3;
	let matrixA = createMatrix(matrixSize);
	let matrixB = createArray(matrixSize);
</script>

<svelte:head>
	<title>Guass Elimination Methods</title>
	<meta name="description" content="Guass Elimination Methods" />
</svelte:head>

<h3 class="text-center">🥹 Guass Elimination Methods</h3>

<LinearAlgebraInput {matrixA} {matrixB} {matrixSize} onClickCalculate={(e) => console.log(e)} />
