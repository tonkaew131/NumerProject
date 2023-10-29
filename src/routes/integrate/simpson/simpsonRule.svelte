<script lang="ts">
	import Icon from '@iconify/svelte';
	import { evaluate } from 'mathjs';
	import type { Shape } from 'plotly.js';

	import Graph from '$lib/components/graph.svelte';
	import KaTex from '$lib/components/KaTex.svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog';
	import type { SimpsonResult } from '$lib/solutions/simpsonRule';

	import Input from './input.svelte';

	let inputData = {
		xStart: '',
		xEnd: '',
		formula: '',
		errorFactor: 0.000001
	};

	let modalMessage = {
		title: '',
		description: ''
	};
	let loading = false;

	let result: SimpsonResult & {
		input: typeof inputData;
	};

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

		const res = await fetch('/api/solution/integrate/simpson', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				xStart: inputData.xStart,
				xEnd: inputData.xEnd,
				func: inputData.formula,
				n: 1
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
	<title>Single Simpson's Rule</title>
	<meta name="description" content="Single Simpson's Rule - Numerical Integration" />
</svelte:head>

<h3 class="text-center">🥹 Single Simpson's Rule</h3>

<Input
	bind:xStart={inputData.xStart}
	bind:xEnd={inputData.xEnd}
	bind:formula={inputData.formula}
	onClickCalculate={() => computeResult()}
/>

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

<!-- <Card.Root class="">
	<Card.Content class="py-5">
		<KaTex data={'\\text{Graph}'} class="pl-6" block />
		{#key result}
			<Graph
				graphData={[
					{
						x: result?.graphLine?.x || [],
						y: result?.graphLine?.y || [],
						mode: 'lines',
						line: {
							width: 2
						},
						name: 'f(x)'
					}
				]}
				layout={{
					shapes: [
						{
							type: 'line',
							xref: 'x',
							yref: 'y',
							x0: result?.trapezoidLine?.top?.x0 || 0,
							y0: result?.trapezoidLine?.top?.y0 || 0,
							x1: result?.trapezoidLine?.top?.x1 || 0,
							y1: result?.trapezoidLine?.top?.y1 || 0,
							line: {
								color: 'black',
								width: 2,
								dash: 'dashdot'
							}
						},
						{
							type: 'path',
							path: result?.trapezoidShape || '',
							fillcolor: 'rgba(209,255,156,0.3)',
							line: {
								color: 'rgba(0, 0, 0, 0)',
								width: 2
							}
						},
						...trapezoidLine()
					]
				}}
			/>
		{/key}
	</Card.Content>
</Card.Root> -->

<Card.Root class="w-full">
	<Card.Content class="py-5">
		<KaTex data={'\\text{Solution}'} class="pl-6" block />
		{#if loading}
			<div class="w-full flex justify-center py-16">
				<Icon icon="eos-icons:loading" class="text-center text-6xl text-primary" />
			</div>
		{:else}
			{#key result}
				{#if result}
					{@const precision = 6}
					{@const h = (Number(result.input.xEnd) - Number(result.input.xStart)) / 2}
					<KaTex
						class="w-fit mx-auto"
						block
						data={`
					\\displaystyle
					\\text{Evaluate} \\quad\\quad
					I = \\int^{${result.input.xEnd}}_{${result.input.xStart}} f(x) \\space dx
					\\space = \\int^{${result.input.xEnd}}_{${result.input.xStart}} ${
							result.input.formula
						} \\space dx \\\\
					\\\\~\\\\
					Here \\quad\\quad\\quad\\space\\space
					h = \\dfrac{b - a}{2} 
					= \\dfrac{${result.input.xEnd} - (${result.input.xStart})}{2} 
					= ${h}
					\\\\~\\\\
					
					\\begin{aligned}
						& f(x_0 = ${result.input.xStart}) & & 
							= ${result.input.formula.replace('x', `(${result.input.xStart})`)} & &
							= ${result.fx.start} \\\\
						& f(x_1 = ${result.fx[1].x}) & & 
							= ${result.input.formula.replace('x', `(${result.fx[1].x})`)} & &
							= ${result.fx[1].y} \\\\
						& f(x_2 = ${result.input.xEnd}) & & 
							= ${result.input.formula.replace('x', `(${result.input.xEnd})`)} & &
							= ${result.fx.end} \\\\
					\\end{aligned}

					\\\\~\\\\
					Thus \\\\
					\\begin{aligned}
					\\therefore I & = \\dfrac{h}{3}(f(x_0) + 4f(x_1) + f(x_2)) \\\\
					& = \\dfrac{${h}}{2}(${result.fx.start} + 4(${result.fx[1].y}) + ${result.fx.end}) \\\\
					& = ${result.result}
					\\end{aligned}
					`}
					/>
					<!-- <KaTex
					class="w-fit mx-auto"
					block
					data={`
					\\displaystyle
					\\text{Thus the true error is:} \\\\
					\\epsilon_t = | \\dfrac{1}{2} | \\times 100\\% = ${0}
				`}
				/> -->
				{:else}
					<p class="text-center text-sm text-muted-foreground py-8">Please enter the function</p>
				{/if}
			{/key}
		{/if}
	</Card.Content>
</Card.Root>
