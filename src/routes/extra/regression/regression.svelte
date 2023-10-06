<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Card from '$lib/components/ui/card';

	import KaTex from '$lib/components/KaTex.svelte';

	import Icon from '@iconify/svelte';

	import Graph from './graph.svelte';
	import Input from './input.svelte';

	let modalMessage = {
		title: '',
		description: ''
	};

	let loading = true;

	let xValue = 0;
</script>

<svelte:head>
	<title>Simple Regression extrapolation</title>
</svelte:head>

<h3 class="text-center">🥹 Simple Regression extrapolation</h3>

<Input bind:xValue onClickCalculate={(e) => console.log('clicked!')} />

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
		<Graph />
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
				<KaTex class="w-fit mx-auto" data={formatResult(result, precision)} block />
				<KaTex class="w-fit mx-auto" data={`f(${result.xValue}) = ${result.result}`} block />
			{/if}
		{/key} -->
	</Card.Content>
</Card.Root>
