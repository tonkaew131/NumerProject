<script lang="ts">
	import Icon from '@iconify/svelte';
	import { matrix } from 'mathjs';

	import { formatMatrix } from '$lib/components/kaTeX';
	import KaTeX from '$lib/components/KaTex.svelte';
	import LinearAlgebraInput from '$lib/components/linearAlgebraInput.svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog';
	import { guassJordanMethod, type GuassJordanType } from '$lib/solutions/guassJordan';
	import { composeMatrix, createArray, createMatrix } from '$lib/utils';

	let modalMessage = {
		title: '',
		description: ''
	};

	export const precision = 6;
	let matrixSize = 3;
	let inputData = {
		matrixA: createMatrix(matrixSize),
		arrayB: createArray(matrixSize)
	};

	export let input = true;

	let loading = false;
	export let result: GuassJordanType & { input: typeof inputData };

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

		const res = await fetch('/api/solution/linear/jordan', {
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
		result.input = inputData;
		formatResultData();
	}

	function formatResultData() {
		result.iterations = guassJordanMethod(result.input.matrixA, result.input.arrayB).iterations;

		console.log(result);
	}
</script>

<svelte:head>
	<title>Guass Jordan Methods</title>
	<meta name="description" content="Linear Algebra equation - Guass Jordan Methods" />
</svelte:head>

<h3 class="text-center">🥹 Guass Jordan Methods</h3>

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

<Card.Root class="w-full mt-12">
	<Card.Content class="py-5">
		<KaTeX class="pl-6" data={`\\text{Solution}`} block />
		{#if loading}
			<div class="w-full flex justify-center py-16">
				<Icon icon="eos-icons:loading" class="text-center text-6xl text-primary" />
			</div>
		{:else}
			{#key result}
				{#if result && result.iterations}
					<KaTeX
						class="flex justify-center"
						data={`\\displaystyle
						\\begin{aligned}
						${result.iterations
							.map((it, idx) => {
								if (!result.iterations) return;

								const oldMatrix =
									idx != 0
										? result.iterations[idx - 1].matrix
										: composeMatrix(result.input.matrixA, result.input.arrayB);
								const newMatrix = it.matrix;
								return `
							${formatMatrix(oldMatrix)}
							& \\xrightarrow{
								${it.mult ? `R_${it.mult.i + 1} = R_${it.mult.i + 1} \\times ${it.mult.fac}` : ''}
								${
									it.elim
										? `R_${it.elim.i + 1} = R_${it.elim.i + 1} - R_${
												it.elim.j + 1
										  } \\times ${parseFloat(it.elim.fac.toFixed(precision))}`
										: ''
								}
								${it.swap ? `R_${it.swap.i + 1} \\leftrightarrow R_${it.swap.j + 1}` : ''}
							} & &
							${formatMatrix(newMatrix)} \\\\~\\\\
							`;
							})
							.join('')}
						\\end{aligned}
						`}
						block
					/>
					<KaTeX
						class="flex justify-center"
						data={result.answers
							?.map((e, idx) => ` x_${idx + 1} = ${parseFloat(e.toFixed(precision))}`)
							.join(', \\space')}
						block
					/>
				{:else}
					<p class="text-center text-sm text-muted-foreground">Please enter the matrix</p>
				{/if}
			{/key}
		{/if}
	</Card.Content>
</Card.Root>
