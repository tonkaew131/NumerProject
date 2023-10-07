<script lang="ts">
	// shadcn components
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Card from '$lib/components/ui/card';

	import KaTex from '$lib/components/KaTex.svelte';

	import Icon from '@iconify/svelte';

	// local components
	import Graph from './graph.svelte';
	import Input from './input.svelte';

	let modalMessage = {
		title: '',
		description: ''
	};

	let loading = true;

	let xStart: number;
	let xEnd: number;
	let formula: string = '';
</script>

<svelte:head>
	<title>Graphical methods</title>
</svelte:head>

<h3 class="text-center">🥹 Graphical methods</h3>

<Input onClickCalculate={(e) => console.log(e)} bind:xStart bind:xEnd bind:formula />

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
		<Graph
			graphData={[
				{
					x: [1, 2, 3, 4],
					y: [1, 2, 3, 4],
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
		<!-- {#key result}
		{/key} -->
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
