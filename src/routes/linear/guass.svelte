<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Tabs from '$lib/components/ui/tabs';

	export const precision = 4;

	import LinearAlgebraInput from '$lib/components/linearAlgebraInput.svelte';

	import { guassEliminationMethods } from '$lib/solutions/guass';
	import KaTeX from '$lib/components/kaTeX.svelte';
	import { formatMatrix, formatVector } from '$lib/components/kaTeX';

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

	let result = guassEliminationMethods(
		[
			[-2, 3, 1],
			[3, 4, -5],
			[1, -2, 1]
		],
		[9, 0, -4]
	);
</script>

<svelte:head>
	<title>Guass Elimination Methods</title>
	<meta name="description" content="Guass Elimination Methods" />
</svelte:head>

<h3 class="text-center">🥹 Guass Elimination Methods</h3>

<LinearAlgebraInput
	bind:matrixA
	bind:matrixB
	bind:matrixSize
	onClickCalculate={(e) => console.log(e)}
/>

<Tabs.Root value="solution" class="w-full mt-12 overflow-auto">
	<Tabs.List>
		<Tabs.Trigger value="table">Table</Tabs.Trigger>
		<Tabs.Trigger value="solution">Solution</Tabs.Trigger>
	</Tabs.List>
	<Tabs.Content value="table">
		<Card.Root class="w-full">
			<Card.Content>
				<p class="mb-0">TABLE GOES HERE</p>
			</Card.Content>
		</Card.Root>
	</Tabs.Content>
	<Tabs.Content value="solution">
		<Card.Root class="w-full">
			<Card.Content>
				<p class="mb-0">
					<KaTeX class="pl-6" data={`\\text{Forward Elimination}`} block />
					{#each result.iterations as it}
						{#if it.matrix && it.matrixk_1}
							<KaTeX
								data={`\\text{factor}: \\dfrac{a_{${it.j + 1}${it.j + 1}}}{a_{${it.i + 1}${
									it.j + 1
								}}} = \\dfrac{${it.matrixk_1[it.j][it.j].toFixed(precision)}}{${it.matrixk_1[it.i][
									it.j
								].toFixed(precision)}} = ${it.factor.toFixed(precision)}`}
								class="flex justify-center"
								block
							/>
							<KaTeX
								class="flex justify-center"
								data={`${formatMatrix(it.matrixk_1, precision, [
									[it.i, it.j],
									[it.j, it.j]
								])} \\xrightarrow[]{\\text{row operation}} ${formatMatrix(it.matrix, precision)}`}
								block
							/>
						{/if}
					{/each}
					<KaTeX class="pl-6" data={`\\text{Back Subtiution}`} block />
				</p>
			</Card.Content>
		</Card.Root>
	</Tabs.Content>
</Tabs.Root>
