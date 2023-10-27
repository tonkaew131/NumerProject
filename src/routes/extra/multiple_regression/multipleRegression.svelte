<script lang="ts">
	// shadcn components
	import Icon from '@iconify/svelte';

	import Graph from '$lib/components/graph.svelte';
	import { formatMatrix, formatVector } from '$lib/components/kaTeX';
	import KaTex from '$lib/components/KaTex.svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog';
	import type { MultipleRegressionResult } from '$lib/solutions/multipleRegression';

	// Local components
	import Input from './input.svelte';

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
		points: {
			xArray: number[];
			yArray: number[];
		}[];
		line: {
			xArray: number[];
			yArray: number[];
		};
	}
	export let result: resultType & MultipleRegressionResult;
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

		const xArray: number[] = [];
		for (const x of Object.values(xValue)) {
			xArray.push(x);
		}

		loading = true;

		const res = await fetch('/api/solution/extra/multiple_regression', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ xPoints: points, yPoints: yPoints, xArray: xArray })
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

		let minX = Infinity;
		let maxX = -Infinity;
		result.points = [];
		for (let i = 0; i < points.length; i++) {
			const pointsArray: { xArray: number[]; yArray: number[] } = { xArray: [], yArray: [] };
			for (let j = 0; j < points[i].length; j++) {
				minX = Math.min(minX, points[i][j]);
				maxX = Math.max(maxX, points[i][j]);

				pointsArray.xArray.push(points[i][j]);
				pointsArray.yArray.push(yPoints[j]);
			}
			result.points.push(pointsArray);
		}

		result.line = {
			xArray: [],
			yArray: []
		};
		let xRange = maxX - minX;
		minX -= xRange * 0.1;
		maxX += xRange * 0.1;
		xRange = maxX - minX;

		// Line min
		let sumY = result.a[0];
		for (let j = 1; j < Object.keys(result.a).length; j++) {
			sumY += result.a[j] * minX;
		}
		result.line.xArray.push(minX);
		result.line.yArray.push(sumY);

		// Line max
		sumY = result.a[0];
		for (let j = 1; j < Object.keys(result.a).length; j++) {
			sumY += result.a[j] * maxX;
		}
		result.line.xArray.push(maxX);
		result.line.yArray.push(sumY);

		console.log(result);
	}
</script>

<svelte:head>
	<title>Multiple Regression extrapolation</title>
</svelte:head>

<h3 class="text-center">🥹 Multiple Regression extrapolation</h3>

{#if input}
	<Input bind:xValue bind:pointsArray bind:yArray onClickCalculate={() => computeResult()} />
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
						x: result?.line?.xArray || [],
						y: result?.line?.yArray || [],
						mode: 'lines',
						line: { color: 'blue', width: 1 },
						name: 'Regression Line'
					},
					...(result?.points || []).map((pt, idx) => {
						return {
							x: pt.xArray,
							y: pt.yArray,
							mode: 'markers',
							marker: {
								size: 6
							},
							name: `x${idx + 1}`
						};
					})
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
						.map((_, idx) => `a_{${idx}} ${idx != 0 ? `x_{${idx}}` : ''}`)
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
				<KaTex
					class="w-fit mx-auto"
					data={`
					\\begin{aligned}
					${Object.keys(result.a)
						.map((a) => {
							return `a_${a} & = ${result.a[Number(a)]}\\\\`;
						})
						.join('')}
					\\end{aligned}
					`}
					block
				/>
				<KaTex
					class="w-fit mx-auto"
					data={`\\therefore f(
						${Object.keys(result.a)
							.map((_, idx) => `x_{${idx + 1}}`)
							.join(',')}) 
					= ${result.result} \\space {\\color{red}\\#}`}
					block
				/>
			{:else}
				<p class="text-center text-sm text-muted-foreground py-8">Please enter the points</p>
			{/if}
		{/key}
	</Card.Content>
</Card.Root>
