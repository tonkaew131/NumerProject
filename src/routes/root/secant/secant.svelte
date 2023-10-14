<script lang="ts">
	import Icon from '@iconify/svelte';

	import Graph from '$lib/components/graph.svelte';
	import KaTex from '$lib/components/KaTex.svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Table from '$lib/components/ui/table';
	import * as Tabs from '$lib/components/ui/tabs';
	import type { SecantResult } from '$lib/solutions/secant';
	import { secantMethod } from '$lib/solutions/secant';

	import Input from './input.svelte';

	let inputData = {
		x0: '',
		x1: '',
		formula: '',
		errorFactor: 0.000001
	};

	let modalMessage = {
		title: '',
		description: ''
	};
	let loading = false;

	let result: SecantResult = {
		result: 2.6457513110645907,
		iter: 7,
		iterations: [
			{
				x: 3.4,
				y: 4.559999999999999
			},
			{
				x: 3.4,
				y: 4.559999999999999
			},
			{
				x: 2.469387755102041,
				y: -0.9021241149521018
			},
			{
				x: 2.623087621696801,
				y: -0.11941132890101969
			},
			{
				x: 2.6465362041769547,
				y: 0.004153880019363676
			},
			{
				x: 2.6457479353827065,
				y: -0.000017862418146386005
			},
			{
				x: 2.6457513105639467,
				y: -2.6491582261201074e-9
			}
		]
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

		const res = await fetch('/api/solution/root/secant', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				x0: inputData.x0,
				x1: inputData.x1,
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

		const resultIterations = secantMethod(
			Number(inputData.x0),
			Number(inputData.x1),
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

		// formatResultData();
	}
</script>

<svelte:head>
	<title>Secant methods</title>
	<meta name="description" content="Secant methods - Root of Eqation" />
</svelte:head>

<h3 class="text-center">🥹 Secant methods</h3>

<Input
	onClickCalculate={() => computeResult()}
	bind:x0={inputData.x0}
	bind:x1={inputData.x1}
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
		<Graph graphData={[]} />
		<!-- {#key result}
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
		{/key} -->
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
