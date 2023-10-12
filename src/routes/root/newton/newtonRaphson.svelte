<script lang="ts">
	import Icon from '@iconify/svelte';

	import Graph from '$lib/components/graph.svelte';
	import KaTex from '$lib/components/KaTex.svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Table from '$lib/components/ui/table';
	import * as Tabs from '$lib/components/ui/tabs';

	import Input from './input.svelte';

	let inputData = {
		xStart: 0,
		formula: '',
		errorFactor: 0.000001
	};

	let modalMessage = {
		title: '',
		description: ''
	};

	let loading = false;
</script>

<svelte:head>
	<title>Newton-Raphson methods</title>
	<meta name="description" content="Newton-Raphson methods - Root of Eqation" />
</svelte:head>

<h3 class="text-center">🥹 Newton-Raphson methods</h3>

<Input
	onClickCalculate={() => console.log()}
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
		<!-- {#key result} -->
		<Graph graphData={[]} />
		<!-- {/key} -->
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
