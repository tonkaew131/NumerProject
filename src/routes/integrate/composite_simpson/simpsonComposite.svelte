<script lang="ts">
	import Icon from '@iconify/svelte';
	import { evaluate } from 'mathjs';

	import Graph from '$lib/components/graph.svelte';
	import KaTex from '$lib/components/KaTex.svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog';
	import type { TrapezoidalResult } from '$lib/solutions/trapezoidalRule';

	import Input from './input.svelte';
	let inputData = {
		xStart: '',
		xEnd: '',
		n: '',
		formula: '',
		errorFactor: 0.000001
	};

	let modalMessage = {
		title: '',
		description: ''
	};
	let loading = false;

	let result: TrapezoidalResult & {
		input: typeof inputData;
		graphLine: {
			x: number[];
			y: number[];
		};
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
				n: inputData.n
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
		return;
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

		console.log(result);
	}

	// function trapezoidLine(): Partial<Shape>[] {
	// 	return (result?.trapezoidLine?.other || []).map((le) => {
	// 		return {
	// 			type: 'line',
	// 			xref: 'x',
	// 			yref: 'y',
	// 			x0: le.x0,
	// 			y0: le.y0,
	// 			x1: le.x1,
	// 			y1: le.y1,
	// 			line: {
	// 				color: 'black',
	// 				width: 2,
	// 				dash: 'solid'
	// 			}
	// 		};
	// 	});
	// }
</script>

<svelte:head>
	<title>Composite Simpson's Rule</title>
	<meta name="description" content="Composite Simpson's Rule - Numerical Integration" />
</svelte:head>

<h3 class="text-center">🥹 Composite Simpson's Rule</h3>

<Input
	bind:xStart={inputData.xStart}
	bind:xEnd={inputData.xEnd}
	bind:formula={inputData.formula}
	bind:n={inputData.n}
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
			/>
		{/key}
	</Card.Content>
</Card.Root> -->

<Card.Root class="w-full">
	<Card.Content class="py-5 w-full">
		<KaTex data={'\\text{Solution}'} class="pl-6" block />
		{#if loading}
			<div class="w-full flex justify-center py-16">
				<Icon icon="eos-icons:loading" class="text-center text-6xl text-primary" />
			</div>
		{:else}
			{#key result}
				{#if result}
					{@const precision = 6}
					{@const h =
						(Number(result.input.xEnd) - Number(result.input.xStart)) /
						(Number(result.input.n) * 2)}
					<KaTex
						class="w-fit mx-auto"
						style="word-wrap: break-word;"
						block
						data={`\\displaystyle
					\\displaystyle
					\\text{Evaluate} \\quad\\quad
					I = \\int^{${result.input.xEnd}}_{${result.input.xStart}} f(x) \\space dx
					\\space = \\int^{${result.input.xEnd}}_{${result.input.xStart}} ${
							result.input.formula
						} \\space dx \\\\~\\\\
					Here \\quad\\quad\\quad\\space\\space
					h = \\dfrac{b - a}{n} = 
					\\dfrac{${result.input.xEnd} - ${result.input.xStart}}{${result.input.n}} =
					${h} 
					\\\\~\\\\
					\\begin{aligned}

					& f(x_{0} = ${result.input.xStart}) & & 
					= ${result.input.formula.replaceAll('x', `(${result.input.xStart})`)} & &
					= ${result.fx.start}\\\\
					${Object.keys(result.fx)
						.filter((f) => f != 'start' && f != 'end')
						.map((f) => {
							const x = result.fx[Number(f)].x;
							const y = result.fx[Number(f)].y;
							const func = result.input.formula.replaceAll('x', `(${x})`);
							return `& f(x_{${f}} = ${x}) & & = ${func} & & = ${y} \\\\`;
						})
						.join('')}
					& f(x_{${Number(result.input.n) * 2}} = ${result.input.xEnd}) & & 
					= ${result.input.formula.replaceAll('x', `(${result.input.xEnd})`)} & &
					= ${result.fx.end}\\\\

					\\end{aligned}
					\\\\~\\\\
					`}
					/>
					<KaTex
						class="max-w-2xl w-fit mx-auto"
						data={`\\displaystyle
                        Thus \\\\
                        \\therefore
                        I  = \\dfrac{h}{3}\\left[
                            f(x_0) + 
                            f(x_{${Number(result.input.n) * 2}}) + 
                            4\\sum_{i=1,3,5}^{${Number(result.input.n) * 2} - 1} f(x_i) +
                            2\\sum_{i=2,4,6}^{${Number(result.input.n) * 2} - 2} f(x_i)
                        \\right]
                        \\\\~\\\\
                        \\space\\space\\space\\space\\space\\space\\space 
                        = \\dfrac{${h}}{3}\\Biggr[
                            f(${result.input.xStart}) + 
                            f(${result.input.xEnd}) + 
                            4 \\biggr[ ${Object.keys(result.fx)
															.filter((f) => Number(f) % 2 == 1)
															.map((f) => {
																if (f == 'start' || f == 'end') return '';

																return `f(${result.fx[Number(f)].x})`;
															})
															.join('+')}
                            \\biggr] + 
                            2 \\biggr[ ${Object.keys(result.fx)
															.filter((f) => Number(f) % 2 == 0)
															.map((f) => {
																if (f == 'start' || f == 'end') return '';

																return `f(${result.fx[Number(f)].x})`;
															})
															.join('+')}
                            \\biggr]
                        \\Biggr] \\\\~\\\\
                        \\space\\space\\space\\space\\space\\space\\space 
                        = \\dfrac{${h}}{3}[
                            ${result.fx.start} +
                            ${result.fx.end} +
                            4(${Object.keys(result.fx)
															.filter((f) => Number(f) % 2 == 1)
															.map((f, idx) => {
																if (f == 'start' || f == 'end') return '';

																let str = '';
																if (idx != 0 && result.fx[Number(f)].y >= 0) str += '+';
																str += result.fx[Number(f)].y;
																return str;
															})
															.join('')}) +
                            2(${Object.keys(result.fx)
															.filter((f) => Number(f) % 2 == 0)
															.map((f, idx) => {
																if (f == 'start' || f == 'end') return '';

																let str = '';
																if (idx != 0 && result.fx[Number(f)].y >= 0) str += '+';
																str += result.fx[Number(f)].y;
																return str;
															})
															.join('')})
                        ] \\\\
                        \\space\\space\\space\\space\\space\\space\\space = ${result.result}
                        `}
						block
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

<style>
	:global(.katex) {
		white-space: normal;
	}

	:global(.katex .katex-html) {
		overflow-wrap: normal;
	}

	:global(.katex .mord) {
		display: inline-block;
	}
</style>
