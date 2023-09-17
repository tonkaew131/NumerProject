<script lang="ts">
	import LinearAlgebraInput from '$lib/components/linearAlgebraInput.svelte';

	import { formatMatrix } from '$lib/components/kaTeX';
	import KaTeX from '$lib/components/kaTeX.svelte';

	import * as Dialog from '$lib/components/ui/dialog';
	import * as Card from '$lib/components/ui/card';
	import * as Tabs from '$lib/components/ui/tabs';

	import type { GuassType } from '$lib/solutions/guass';

	import Icon from '@iconify/svelte';

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

	let modalMessage = {
		title: '',
		description: ''
	};

	let matrixSize: number = 3;
	let matrixA = createMatrix(matrixSize);
	let matrixB = createArray(matrixSize);

	export let input = true;

	let loading = false;
	export let result: GuassType = { iterations: [] };
	async function computeResult() {
		loading = true;

		// result = guassEliminationMethods(matrixA, matrixB);
		const res = await fetch('/api/solution/linear/guass', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ matrix_a: matrixA, array_b: matrixB })
		});
		const jsonData = await res.json();

		if (jsonData.error) {
			console.log(jsonData.error);
			return;
		}

		result = jsonData.data;
		loading = false;

		result = result;
	}
</script>

<svelte:head>
	<title>Guass Elimination Methods</title>
	<meta name="description" content="Guass Elimination Methods" />
</svelte:head>

<h3 class="text-center">🥹 Guass Elimination Methods</h3>

{#if input}
	<LinearAlgebraInput
		bind:matrixA
		bind:matrixB
		bind:matrixSize
		onClickCalculate={(e) => computeResult()}
	/>
{/if}

{#if input}
	<Dialog.Root>
		<Dialog.Trigger id="trigger-modal" />
		<Dialog.Content>
			<Dialog.Header>
				<Dialog.Title>{modalMessage.title}</Dialog.Title>
				<Dialog.Description>
					{modalMessage.description}
				</Dialog.Description>
			</Dialog.Header>
		</Dialog.Content>
	</Dialog.Root>
{/if}

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
						{:else if loading}
							<div class="w-full flex justify-center py-16">
								<Icon icon="eos-icons:loading" class="text-center text-6xl text-primary" />
							</div>
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
						{:else if loading}
							<div class="w-full flex justify-center py-16">
								<Icon icon="eos-icons:loading" class="text-center text-6xl text-primary" />
							</div>
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
