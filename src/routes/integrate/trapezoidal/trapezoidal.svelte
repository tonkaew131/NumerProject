<script lang="ts">
	import Icon from '@iconify/svelte';
	import { evaluate } from 'mathjs';

	import Graph from '$lib/components/graph.svelte';
	import KaTex from '$lib/components/KaTex.svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog';
	import type { TrapezoidalResult } from '$lib/solutions/trapezoidalRule';

	import Input from './input.svelte';
	import type { Shape } from 'plotly.js';
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

	let result: TrapezoidalResult & {
		graphLine: {
			x: number[];
			y: number[];
		};
		trapezoidLine: {
			top: {
				x0: number;
				y0: number;
				x1: number;
				y1: number;
			};
			other: {
				x0: number;
				y0: number;
				x1: number;
				y1: number;
			}[];
		};
		trapezoidShape: string;
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

		const res = await fetch('/api/solution/integrate/trapezoidal', {
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
		formatResultData();
	}

	function formatResultData() {
		const range = Number(inputData.xEnd) - Number(inputData.xStart);
		const minX = Number(inputData.xStart) - range * 0.1;
		const maxX = Number(inputData.xEnd) + range * 0.1;
		result.graphLine = {
			x: [],
			y: []
		};
		for (let i = 0; i < 100; i++) {
			const x = minX + (maxX - minX) * (i / 100);
			result.graphLine.x.push(x);
			result.graphLine.y.push(evaluate(inputData.formula, { x }));
		}

		result.trapezoidLine = { top: { x0: 0, y0: 0, x1: 0, y1: 0 }, other: [] };
		result.trapezoidLine.top.x0 = Number(inputData.xStart);
		result.trapezoidLine.top.y0 = evaluate(inputData.formula, { x: Number(inputData.xStart) });
		result.trapezoidLine.top.x1 = Number(inputData.xEnd);
		result.trapezoidLine.top.y1 = evaluate(inputData.formula, { x: Number(inputData.xEnd) });

		// left
		result.trapezoidLine.other.push({
			x0: Number(inputData.xStart),
			y0: 0,
			x1: Number(inputData.xStart),
			y1: evaluate(inputData.formula, { x: Number(inputData.xStart) })
		});
		// right
		result.trapezoidLine.other.push({
			x0: Number(inputData.xEnd),
			y0: 0,
			x1: Number(inputData.xEnd),
			y1: evaluate(inputData.formula, { x: Number(inputData.xEnd) })
		});

		result.trapezoidShape = `M ${result.trapezoidLine.top.x0} 0 L ${result.trapezoidLine.top.x0} ${result.trapezoidLine.top.y0} L ${result.trapezoidLine.top.x1} ${result.trapezoidLine.top.y1} L ${result.trapezoidLine.top.x1} 0 Z`;

		console.log(result);
	}

	function trapezoidLine(): Partial<Shape>[] {
		return (result?.trapezoidLine?.other || []).map((le) => {
			return {
				type: 'line',
				xref: 'x',
				yref: 'y',
				x0: le.x0,
				y0: le.y0,
				x1: le.x1,
				y1: le.y1,
				line: {
					color: 'black',
					width: 2,
					dash: 'solid'
				}
			};
		});
	}
</script>

<svelte:head>
	<title>Single Trapezoidal Rule</title>
	<meta name="description" content="Single Trapezoidal Rule - Numerical Integration" />
</svelte:head>

<h3 class="text-center">🥹 Single Trapezoidal Rule</h3>

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

<Card.Root class="">
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
</Card.Root>

<Card.Root class="w-full mt-12">
	<Card.Content class="py-5">
		<KaTex data={'\\text{Solution}'} class="pl-6" block />
		{#if loading}
			<div class="w-full flex justify-center py-16">
				<Icon icon="eos-icons:loading" class="text-center text-6xl text-primary" />
			</div>
		{/if}
		<!-- {#key result}
					{#if result}
						{@const precision = 6}
						<KaTex
							class="w-fit mx-auto"
							block
							data={`f(x) = ${result.matrixB
								.map((_, idx) => `a_{${idx}} ${idx != 0 ? 'x' : ''} ${idx > 1 ? `^{${idx}}` : ''}`)
								.join('+')}
								`}
						/>
						<KaTex
							class="w-fit mx-auto"
							data={`${formatMatrix(result.matrixA, precision)}
							\\begin{Bmatrix}
							${result.matrixB.map((_, idx) => `a_{${idx}}`).join('\\\\')}
							\\end{Bmatrix}
							= 
							${formatVector(result.matrixB, precision)}`}
							block
						/>
						<KaTex class="w-fit mx-auto" data={formatResult()} block />
						<KaTex
							class="w-fit mx-auto"
							data={`\\therefore f(${result.xValue}) = ${result.result} \\space {\\color{red}\\#}`}
							block
						/>
					{:else}
						<p class="text-center text-sm text-muted-foreground py-8">Please enter the points</p>
					{/if}
				{/key} -->
	</Card.Content>
</Card.Root>
