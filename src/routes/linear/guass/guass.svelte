<script lang="ts">
	import Icon from '@iconify/svelte';

	import { formatMatrix } from '$lib/components/kaTeX';
	import KaTeX from '$lib/components/KaTex.svelte';
	import LinearAlgebraInput from '$lib/components/linearAlgebraInput.svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog';
	import type { GuassType } from '$lib/solutions/guass';
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
	export let result: GuassType & { input: typeof inputData };

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

		const res = await fetch('/api/solution/linear/guass', {
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

		console.log(result);
	}
</script>

<svelte:head>
	<title>Guass Elimination Methods</title>
	<meta name="description" content="Linear Algebra equation - Guass Elimination Methods" />
</svelte:head>

<h3 class="text-center">🥹 Guass Elimination Methods</h3>

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
				{#if result}
					<KaTeX class="pl-6" data={`\\text{Forward Elimination}`} block />
					{#each result.iterations.filter((e) => e.type !== 'back') as it, idx}
						{@const oldMatrix =
							idx != 0
								? result?.iterations[idx - 1]?.matrix
								: composeMatrix(result.input.matrixA, result.input.arrayB)}
						{#if oldMatrix && it.matrix}
							{#if it.type == 'forw'}
								<KaTeX
									data={`
						\\text{factor}:
						\\dfrac{a_{${it.j + 1}${it.j + 1}}}
						{a_{${it.i + 1}${it.j + 1}}} = 
						\\dfrac{${parseFloat(oldMatrix[it.j][it.j].toFixed(precision))}}
						{${parseFloat(oldMatrix[it.i][it.j].toFixed(precision))}} = 
						${parseFloat(it.factor?.toFixed(precision) || '0')}
						`}
									class="flex justify-center"
									block
								/>
								<KaTeX
									class="flex justify-center"
									data={`
										${formatMatrix(oldMatrix, precision, [
											[it.i, it.j],
											[it.j, it.j]
										])}
										 \\xrightarrow[]{\\text{R${it.i + 1}}\\space \\rArr \\space \\text{f} \\times \\text{R${
										it.i + 1
									}}-\\text{R${it.j + 1}}} ${formatMatrix(it.matrix, precision)}`}
									block
								/>
							{:else}
								<KaTeX
									class="flex justify-center"
									data={`
											${formatMatrix(oldMatrix, precision)}
											 \\xrightarrow[]{
												\\text{R${it.i + 1}} \\space 
												\\Longleftrightarrow
												\\text{R${it.j + 1}}
											} 
											${formatMatrix(it.matrix, precision)}
											`}
									block
								/>
							{/if}
						{/if}
					{/each}
					<KaTeX class="pl-6" data={`\\text{Back Subtiution}`} block />
					{#each result.iterations.filter((e) => e.type == 'back') as it}
						<KaTeX
							class="flex justify-center"
							data={`
									x_${it.i + 1} = 
									\\dfrac{
										b_{${it.i + 1}}${it.sumIdx?.length == 0 ? '' : '-'}
										${it.sumIdx?.map((e) => `a_{${it.i + 1}${e + 1}}x_{${e}}`).join('-')}}
										{a_{${it.i + 1}${it.i + 1}}} 
									=
									${parseFloat((it.value || 0).toFixed(precision))}
								`}
							block
						/>
					{/each}
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
