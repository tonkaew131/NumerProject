<script lang="ts">
	// shadcn components
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Table from '$lib/components/ui/table';
	import * as Card from '$lib/components/ui/card';
	import * as Tabs from '$lib/components/ui/tabs';

	import Graph from '$lib/components/graph.svelte';
	import KaTex from '$lib/components/KaTex.svelte';

	import Icon from '@iconify/svelte';

	// local components
	import Input from './input.svelte';
	import { onePointIteration, type OnePointIterationResult } from '$lib/solutions/onePoint';
	import { evaluate } from 'mathjs';

	let modalMessage = {
		title: '',
		description: ''
	};

	let loading = false;

	let xStart: number;
	let errorFactor: number;
	let formula: string = '';

	interface resultType {
		resultLine: {
			x: number[];
			y: number[];
		};
		graphLine: {
			x: number[];
			y: number[];
		};
		minX: number;
		maxX: number;
	}
	let result: resultType & OnePointIterationResult;

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

		const res = await fetch('/api/solution/root/one', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ xStart, errorFactor, func: formula })
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

		const resultIterations = onePointIteration(Number(xStart), Number(errorFactor), formula);
		result.iterations = resultIterations.iterations;

		if (result.iterations == undefined) {
			modalMessage = {
				title: 'Calculation Warning!',
				description: 'The function is not convergent'
			};

			document?.getElementById('trigger-modal')!.click();
			return;
		}

		result.resultLine = {
			x: [],
			y: []
		};

		result.minX = Infinity;
		result.maxX = -Infinity;
		for (let i = 0; i < result.iterations.length; i++) {
			const currIter = result.iterations[i];
			// if (i != 0) {
			result.resultLine.x.push(currIter.x);
			result.resultLine.y.push(currIter.x);
			// }

			if (currIter.x < result.minX) result.minX = currIter.x;
			if (currIter.x > result.maxX) result.maxX = currIter.x;

			result.resultLine.x.push(currIter.x);
			result.resultLine.y.push(currIter.y);
		}

		result.minX = result.minX * 1.1;
		result.maxX = result.maxX * 1.1;
		result.graphLine = {
			x: [],
			y: []
		};
		for (let i = 0; i < 1000; i++) {
			const x = result.minX + (i / 1000) * (result.maxX - result.minX);
			result.graphLine.x.push(x);
			result.graphLine.y.push(evaluate(formula, { x }));
		}

		// result = result;
		console.log(result);
	}
</script>

<svelte:head>
	<title>One-point Iteration Methods</title>
	<meta name="description" content="One-point Iteration Methods - Root of Eqation" />
</svelte:head>

<h3 class="text-center">🥹 One-point Iteration Methods</h3>

<Input onClickCalculate={() => computeResult()} bind:xStart bind:formula bind:errorFactor />

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
						x: result?.resultLine?.x || [],
						y: result?.resultLine?.y || [],
						type: 'scatter',
						mode: 'lines',
						marker: {
							color: 'purple',
							size: 4
						},
						line: {
							color: 'red',
							width: 1
						},
						name: 'One-Point'
					},
					{
						x: [result?.minX, result?.maxX],
						y: [result?.minX, result?.maxX],
						mode: 'lines',
						line: {
							width: 0.5,
							color: 'blue'
						},
						name: 'x = x'
					},
					{
						x: result?.graphLine?.x || [],
						y: result?.graphLine?.y || [],
						line: {
							width: 0.5
						},
						name: 'g(x)'
					}
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
						<!-- {#if result?.iterations != undefined}
							Total number of iterations: {result.iterations.length}
						{:else}
							Please enter the formula
						{/if} -->
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
						<!-- {#if result?.iterations}
							{@const precision = 6}
							{#each result.iterations as it, idx}
								<Table.Row>
									<Table.Cell>{idx}</Table.Cell>
									<Table.Cell>{parseFloat(it.x.toFixed(precision))}</Table.Cell>
									<Table.Cell>{parseFloat(it.y.toFixed(precision))}</Table.Cell>
									<Table.Cell>{parseFloat((Math.abs(it.y) * 100).toFixed(6))}%</Table.Cell>
								</Table.Row>
							{/each}
						{/if} -->
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
