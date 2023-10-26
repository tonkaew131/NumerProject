<script lang="ts">
	import Icon from '@iconify/svelte';

	import { formatMatrix } from '$lib/components/kaTeX';
	import KaTeX from '$lib/components/KaTex.svelte';
	import LinearAlgebraInput from '$lib/components/linearAlgebraInput.svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Tabs from '$lib/components/ui/tabs';
	import { createArray, createMatrix } from '$lib/utils';
	import type { CramerResult } from '$lib/solutions/cramer';

	export let precision = 4;

	let modalMessage = {
		title: '',
		description: ''
	};
	let loading = false;

	let matrixSize = 3;
	let inputData = {
		matrixA: createMatrix(matrixSize),
		arrayB: createArray(matrixSize)
	};

	export let input = true;

	export let result: CramerResult;

	let timeSinceLastCalculate = 0;
	let COOLDOWN_TIME = 5;
	async function computeResult() {
		if (timeSinceLastCalculate == 0) timeSinceLastCalculate = Date.now();
		else if (Date.now() - timeSinceLastCalculate < COOLDOWN_TIME * 1000) {
			const timeLeft = COOLDOWN_TIME - (Date.now() - timeSinceLastCalculate) / 1000;
			modalMessage = {
				title: 'Calculation Error!',
				description: `Please wait for ${COOLDOWN_TIME} seconds before calculating again (${timeLeft.toFixed(
					1
				)}s)`
			};

			document?.getElementById('trigger-modal')!.click();
			return;
		}

		timeSinceLastCalculate = Date.now();
		loading = true;

		const res = await fetch('/api/solution/linear/cramer', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				matrixA: inputData.matrixA,
				arrayB: inputData.arrayB
			})
		});
		const jsonData = await res.json();

		loading = false;
		if (jsonData.error) {
			modalMessage = {
				title: 'Calculation Error!',
				description: jsonData.error.message
			};

			document?.getElementById('trigger-modal')!.click();
			console.log(jsonData);
		}

		if (jsonData.warning) {
			modalMessage = {
				title: 'Calculation Warning!',
				description: jsonData.warning.message
			};

			document?.getElementById('trigger-modal')!.click();
		}

		result = jsonData.data;

		console.log(result);
		// result.input = inputData;
		// formatResultData();
	}
</script>

<svelte:head>
	<title>Cramer's Rule</title>
	<meta name="description" content="Linear Algebra equation - Cramer's Rule" />
</svelte:head>

<h3 class="text-center">🥹 Cramer's Rule</h3>

{#if input}
	<LinearAlgebraInput
		bind:matrixA={inputData.matrixA}
		bind:matrixB={inputData.arrayB}
		bind:matrixSize
		onClickCalculate={() => computeResult()}
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

<Card.Root class="w-full mt-12 overflow-auto">
	<Card.Content class="mb-0 pt-5">
		Hi :D
		<!-- {#key result}
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
					{/key} -->
	</Card.Content>
</Card.Root>
