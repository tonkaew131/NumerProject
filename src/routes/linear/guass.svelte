<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Tabs from '$lib/components/ui/tabs';

	import LinearAlgebraInput from '$lib/components/linearAlgebraInput.svelte';

	import { guassEliminationMethods, type GuassType } from '$lib/solutions/guass';
	import { formatMatrix } from '$lib/components/kaTeX';
	import KaTeX from '$lib/components/kaTeX.svelte';

	export let precision: number = 4;

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

	let result: GuassType = { iterations: [] };
	function computeResult() {
		console.log(matrixA, matrixB);
		result = guassEliminationMethods(matrixA, matrixB);

		result = result;
	}
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
	onClickCalculate={(e) => computeResult()}
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
					{#key result}
						<KaTeX class="pl-6" data={`\\text{Forward Elimination}`} block />
						{#if result?.iterations && result?.iterations.length > 0}
							{#each result.iterations as it}
								{#if it.matrix && it.matrixk_1}
									<KaTeX
										data={`\\text{factor}: \\dfrac{a_{${it.j + 1}${it.j + 1}}}{a_{${it.i + 1}${
											it.j + 1
										}}} = \\dfrac{${it.matrixk_1[it.j][it.j].toFixed(precision)}}{${it.matrixk_1[
											it.i
										][it.j].toFixed(precision)}} = ${it.factor?.toFixed(precision)}`}
										class="flex justify-center"
										block
									/>
									<KaTeX
										class="flex justify-center"
										data={`${formatMatrix(it.matrixk_1, precision, [
											[it.i, it.j],
											[it.j, it.j]
										])} \\xrightarrow[]{\\text{R${
											it.i + 1
										}}\\space \\rArr \\space \\text{f}\\text{R${it.i + 1}}-\\text{R${
											it.j + 1
										}}} ${formatMatrix(it.matrix, precision)}`}
										block
									/>
								{/if}
							{/each}
						{:else}
							<p class="text-center text-sm text-muted-foreground">Please enter the matrix</p>
						{/if}
						<KaTeX class="pl-6" data={`\\text{Back Subtiution}`} block />
						{#if result?.backIterations}
							{#each result.backIterations as it}
								<KaTeX
									class="flex justify-center"
									data={`x_${it.i + 1} = \\dfrac{b_{${it.i + 1}}${
										it.sumIdx?.length == 0 ? '' : '-'
									}${it.sumIdx?.map((e) => `a_{${it.i + 1}${e + 1}}x_{${e}}`).join('-')}}{a_{${
										it.i + 1
									}${it.i + 1}}}`}
									block
								/>
							{/each}
						{:else}
							<p class="text-center text-sm text-muted-foreground">Please enter the matrix</p>
						{/if}
						{#if result?.answers}
							<KaTeX
								class="flex justify-center"
								data={result.answers
									?.map((e, idx) => ` x_${idx + 1} = ${e.toFixed(precision)}`)
									.join(', \\space')}
								block
							/>
						{/if}
					{/key}
				</p>
			</Card.Content>
		</Card.Root>
	</Tabs.Content>
</Tabs.Root>
