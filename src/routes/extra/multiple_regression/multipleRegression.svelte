<script lang="ts">
	// shadcn components
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Card from '$lib/components/ui/card';

	// Local components
	import Graph from './graph.svelte';
	import Input from './input.svelte';

	import KaTex from '$lib/components/KaTex.svelte';
	import { formatMatrix, formatVector } from '$lib/components/kaTeX';

	import Icon from '@iconify/svelte';

	import type { MultipleRegressionResult } from '$lib/solutions/multipleRegression';

	let modalMessage = {
		title: '',
		description: ''
	};

	let loading = false;

	let xValue: { [key: number]: number } = {};
	let pointsArray: {
		[key: number]: {
			[key: number]: number;
		};
	} = {};
	let yArray: {
		[key: number]: number;
	} = {};
	interface resultType {
		xArray: number[];
		yArray: number[];
	}
	let result: resultType & MultipleRegressionResult;

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
		const points = [];
		for (const pt of Object.values(pointsArray)) {
			const x = [];
			for (const xVal of Object.values(pt)) {
				x.push(xVal);
			}

			points.push(x);
		}

		const yPoints = [];
		for (const yVal of Object.values(yArray)) {
			yPoints.push(yVal);
		}

		loading = true;

		const res = await fetch('/api/solution/extra/multiple_regression', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ xPointsArray: points, yPoints: yPoints, xValue: xValue })
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

		/* const xArray = [];
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

		console.log(result); */
	}
</script>

<svelte:head>
	<title>Multiple Regression extrapolation</title>
</svelte:head>

<h3 class="text-center">🥹 Multiple Regression extrapolation</h3>

<Input bind:xValue bind:pointsArray bind:yArray onClickCalculate={() => computeResult()} />

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
				<!-- <KaTex class="w-fit mx-auto" data={formatResult()} block />
				<KaTex
					class="w-fit mx-auto"
					data={`\\therefore f(${result.xValue}) = ${result.result} \\space {\\color{red}\\#}`}
					block
				/> -->
			{:else}
				<p class="text-center text-sm text-muted-foreground py-8">Please enter the points</p>
			{/if}
		{/key}
	</Card.Content>
</Card.Root>
