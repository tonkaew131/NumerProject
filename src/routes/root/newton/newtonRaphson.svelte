<script lang="ts">
	import Icon from '@iconify/svelte';

	import Graph from '$lib/components/graph.svelte';
	import KaTex from '$lib/components/KaTex.svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Table from '$lib/components/ui/table';
	import * as Tabs from '$lib/components/ui/tabs';

	import Input from './input.svelte';
	import { newtonRaphson, type NewtonRaphsonResult } from '$lib/solutions/newtonRaphson';
	import { evaluate } from 'mathjs';

	let inputData = {
		xStart: '',
		formula: '',
		errorFactor: 0.000001
	};

	let modalMessage = {
		title: '',
		description: ''
	};

	let result: NewtonRaphsonResult & {
		graphLine: {
			x: number[];
			y: number[];
		};
		slopeLine: {
			x: number[];
			y: number[];
		}[];
		minX: number;
		maxX: number;
	};

	let loading = false;

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

		const res = await fetch('/api/solution/root/newton', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				xStart: inputData.xStart,
				errorFactor: inputData.errorFactor,
				func: inputData.formula
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

		const resultIterations = newtonRaphson(
			Number(inputData.xStart),
			Number(inputData.errorFactor),
			inputData.formula
		);
		result.iterations = resultIterations.iterations;

		if (result.iterations == undefined) {
			modalMessage = {
				title: 'Calculation Warning!',
				description: 'The function is not convergent'
			};

			document?.getElementById('trigger-modal')!.click();
			return;
		}

		formatResultData();
	}

	function formatResultData() {
		if (result.iterations == undefined) return;

		result.slopeLine = [];
		result.minX = Infinity;
		result.maxX = -Infinity;
		for (let i = 0; i < result.iterations.length; i++) {
			const currIter = result.iterations[i];

			if (currIter.x < result.minX) result.minX = currIter.x;
			if (currIter.x > result.maxX) result.maxX = currIter.x;

			result.slopeLine.push({
				x: [currIter.x, result.iterations[i != result.iterations.length - 1 ? i + 1 : i].x],
				y: [currIter.y, 0]
			});
		}

		let range = result.maxX - result.minX;
		result.minX = result.minX - range * 0.1;
		result.maxX = result.maxX + range * 0.1;
		result.graphLine = {
			x: [],
			y: []
		};
		for (let i = 0; i < 100; i++) {
			const x = result.minX + (i / 100) * (result.maxX - result.minX);
			result.graphLine.x.push(x);
			result.graphLine.y.push(evaluate(inputData.formula, { x }));
		}

		// result = result;
		console.log(result);
	}
</script>

<svelte:head>
	<title>Newton-Raphson methods</title>
	<meta name="description" content="Newton-Raphson methods - Root of Eqation" />
</svelte:head>

<h3 class="text-center">🥹 Newton-Raphson methods</h3>

<Input
	onClickCalculate={() => computeResult()}
	bind:xStart={inputData.xStart}
	bind:formula={inputData.formula}
	bind:errorFactor={inputData.errorFactor}
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
					},
					...(result?.slopeLine || []).map((ln, idx) => {
						return {
							x: ln.x,
							y: ln.y,
							mode: 'lines+markers',
							line: {
								color: 'red',
								width: 2
							},
							marker: {
								color: 'black'
							},
							name: `f'(x${idx})`
						};
					})
				]}
			/>
		{/key}
	</Card.Content>
</Card.Root>

<Tabs.Root value="table" class="w-full mt-12">
	<Tabs.List>
		<Tabs.Trigger value="table">Table</Tabs.Trigger>
		<Tabs.Trigger value="solution">Solution</Tabs.Trigger>
	</Tabs.List>
	<Tabs.Content value="table">
		<Card.Root class="">
			<Card.Content class="py-5">
				<KaTex data={'\\text{Table}'} class="pl-6" block />
				{#if loading}
					<div class="w-full flex justify-center py-16">
						<Icon icon="eos-icons:loading" class="text-center text-6xl text-primary" />
					</div>
				{/if}
				<Table.Root>
					<Table.Caption>
						{#if result?.iterations != undefined}
							Total number of iterations: {result.iterations.length}
						{:else}
							Please enter the formula
						{/if}
					</Table.Caption>
					<Table.Header>
						<Table.Head class="w-12">
							<KaTex data="\text&lcub;iter&rcub;" />
						</Table.Head>
						<Table.Head>
							<KaTex data="x_k" />
						</Table.Head>
						<Table.Head>
							<KaTex data="y_k" />
						</Table.Head>
						<Table.Head>
							<KaTex data="error\%" />
						</Table.Head>
					</Table.Header>
					<Table.Body>
						{#if result?.iterations}
							{@const precision = 6}
							{#each result.iterations as it, idx}
								<Table.Row>
									<Table.Cell>{idx}</Table.Cell>
									<Table.Cell>{parseFloat(it.x.toFixed(precision))}</Table.Cell>
									<Table.Cell>{parseFloat(it.y.toFixed(precision))}</Table.Cell>
									<Table.Cell>{parseFloat((Math.abs(it.y) * 100).toFixed(6))}%</Table.Cell>
								</Table.Row>
							{/each}
						{/if}
					</Table.Body>
				</Table.Root>
			</Card.Content>
		</Card.Root>
	</Tabs.Content>
	<Tabs.Content value="solution">
		<Card.Root class="">
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
	</Tabs.Content>
</Tabs.Root>
