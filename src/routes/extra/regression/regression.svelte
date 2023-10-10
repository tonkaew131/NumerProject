<script lang="ts">
	// shadcn components
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Card from '$lib/components/ui/card';

	import KaTex from '$lib/components/KaTex.svelte';
	import { formatMatrix, formatVector } from '$lib/components/kaTeX';

	import Icon from '@iconify/svelte';

	// Local components
	import Graph from './graph.svelte';
	import Input from './input.svelte';

	import type { SimpleRegressionResult } from '$lib/solutions/simpleRegression';

	let modalMessage = {
		title: '',
		description: ''
	};

	let loading = false;

	let xValue = 0;
	let mOrder = 1;
	let points: {
		[key: number]: {
			x: number;
			y: number;
		};
	} = {};
	interface resultType {
		xArray: number[];
		yArray: number[];
		xValue: number;
		xLineArray: number[];
		yLineArray: number[];
	}
	export let result: resultType & SimpleRegressionResult;
	export let input = true;

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
		const pointsArray = [];
		for (const pt of Object.values(points)) {
			pointsArray.push(pt);
		}

		loading = true;

		const res = await fetch('/api/solution/extra/simple_regression', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ points: pointsArray, m: Number(mOrder), x: Number(xValue) })
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

			return;
		}

		if (jsonData.warning) {
			modalMessage = {
				title: 'Calculation Warning!',
				description: jsonData.warning.message
			};

			document?.getElementById('trigger-modal')!.click();
		}

		result = jsonData.data;

		const xArray = [];
		const yArray = [];
		let minX = Infinity;
		let maxX = -Infinity;

		for (const pt of pointsArray) {
			minX = Math.min(minX, pt.x);
			maxX = Math.max(maxX, pt.x);

			xArray.push(pt.x);
			yArray.push(pt.y);
		}

		const xLineArray = [];
		const yLineArray = [];
		for (let i = 0; i < 1000; i++) {
			const x = minX + (maxX - minX) * (i / 1000);
			xLineArray.push(x);
			let sumY = 0;
			for (let j = 0; j < Object.keys(result.a).length; j++) {
				sumY += result.a[j] * Math.pow(x, j);
			}
			yLineArray.push(sumY);
		}

		result.xArray = xArray;
		result.yArray = yArray;
		result.xLineArray = xLineArray;
		result.yLineArray = yLineArray;
		result.xValue = xValue;
		result = result;

		console.log(result);
	}

	function formatResult() {
		let str = 'f(x) = ';
		for (let i = 0; i < Object.keys(result.a).length; i++) {
			const isLast = Object.keys(result.a).length - 1 == i;
			str += `${i != 0 ? '{\\color{white}f(x) = }' : ''} 
			${i != 0 && result.a[i] >= 0 ? '+' : ''}
			${result.a[i]} 
			* ${i != 0 ? 'x' : ''} 
			${i > 1 ? `^{${i}}` : ''} 
			${isLast ? '' : `\\\\`}`;
		}

		return str;
	}
</script>

<svelte:head>
	<title>Simple Regression extrapolation</title>
</svelte:head>

<h3 class="text-center">🥹 Simple Regression extrapolation</h3>

{#if input}
	<Input bind:xValue bind:mOrder bind:points onClickCalculate={() => computeResult()} />
{/if}

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
						x: result?.xArray || [],
						y: result?.yArray || [],
						type: 'scatter',
						mode: 'markers',
						marker: {
							color: 'red',
							size: 10
						},
						name: 'Points'
					},
					{
						x: result?.xLineArray || [],
						y: result?.yLineArray || [],
						mode: 'lines',
						line: { color: 'orange' },
						name: 'Regression Line'
					}
				]}
			/>
		{/key}
	</Card.Content>
</Card.Root>

<Card.Root class="mt-12">
	<Card.Content class="py-5">
		<KaTex data={'\\text{Solution}'} class="pl-6" block />
		{#if loading}
			<div class="w-full flex justify-center py-16">
				<Icon icon="eos-icons:loading" class="text-center text-6xl text-primary" />
			</div>
		{/if}
		{#key result}
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
		{/key}
	</Card.Content>
</Card.Root>
