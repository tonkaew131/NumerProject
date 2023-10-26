<script lang="ts">
	import Icon from '@iconify/svelte';

	import { formatMatrixPipe } from '$lib/components/kaTeX';
	import LinearAlgebraInput from '$lib/components/linearAlgebraInput.svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog';
	import { createArray, createMatrix } from '$lib/utils';
	import type { CramerResult } from '$lib/solutions/cramer';
	import KaTex from '$lib/components/KaTex.svelte';

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

	export let result: CramerResult & { input: typeof inputData };

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
		result.input = inputData;

		console.log(result);
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

<Card.Root class="w-full mt-12">
	<Card.Content class="py-5">
		<KaTex class="pl-6" data={`\\text{Solution}`} block />
		{#if loading}
			<div class="w-full flex justify-center py-16">
				<Icon icon="eos-icons:loading" class="text-center text-6xl text-primary" />
			</div>
		{:else}
			{#key result}
				{#if result}
					<KaTex
						class="w-fit mx-auto"
						data={`\\text{From Cramer's Rule}; \\space x_i = \\dfrac{det(A_i)}{det(A)}`}
						block
					/>
					<KaTex
						class="w-fit mx-auto"
						data={`det(A) = ${formatMatrixPipe(result.input.matrixA)} = ${result.detA}`}
						block
					/>
					<KaTex
						class="w-fit mx-auto"
						data={`${result.detAi
							.map((m, idx) => {
								return `
								x_{${idx + 1}} = 
								\\dfrac{det(A_{${idx + 1}})}{det(A)} =
								\\dfrac{${formatMatrixPipe(result.matrixAi[idx])}}{${result.detA}} =
								\\dfrac{${m}}{${result.detA}} =
								${result.result[idx]}`;
							})
							.join('\\\\')}
						`}
						block
					/>
					<KaTex
						class="w-fit mx-auto"
						data={`
						\\therefore
						(${result.detAi.map((m, idx) => `x_{${idx + 1}}`).join(', ')}) =
						(${result.result.map((m) => `${m}`).join(', ')})
						`}
						block
					/>
				{:else}
					<p class="text-center text-sm text-muted-foreground py-8">Please enter the matrix</p>
				{/if}
			{/key}
		{/if}
	</Card.Content>
</Card.Root>
