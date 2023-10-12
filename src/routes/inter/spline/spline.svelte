<script lang="ts">
	import InterpolationInput from '$lib/components/interpolationInput.svelte';
	import KaTex from '$lib/components/KaTex.svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Tabs from '$lib/components/ui/tabs';
	import { splineInterpolation } from '$lib/solutions/spline';

	let pointSize = 3;
	let xValue: number;
	let points: {
		[key: number]: {
			x: number;
			y: number;
		};
	} = {};
	export let selectedPoint: number[] = [];

	let modalMessage = {
		title: '',
		description: ''
	};
</script>

<svelte:head>
	<title>Spline interpolation</title>
</svelte:head>

<h3 class="text-center">🥹 Spline interpolation</h3>

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

<Tabs.Root value="linear" class="mx-auto w-fit">
	<Tabs.List class="" style="--background: 142, 71%, 45%; --foreground: 0, 0%, 100%;">
		<Tabs.Trigger value="linear">Linear</Tabs.Trigger>
		<Tabs.Trigger value="quadratic">Quadratic</Tabs.Trigger>
		<Tabs.Trigger value="Cubic">Cubic</Tabs.Trigger>
	</Tabs.List>
</Tabs.Root>

<InterpolationInput
	bind:points
	bind:xValue
	bind:pointSize
	bind:selectedPoint
	selectedButton={false}
	onClickCalculate={(e) => console.log('clicked!')}
/>

<Card.Root class="mt-12">
	<Card.Content class="py-5">
		<KaTex data={'\\text{Solution}'} class="pl-6" block />
		<!-- {#if loading}
			<div class="w-full flex justify-center py-16">
				<Icon icon="eos-icons:loading" class="text-center text-6xl text-primary" />
			</div>
		{/if}
		{#key result}
			{#if result && !loading}
				{@const precision = 6}
				{#each formatResult(result, precision) as str}
					<KaTex class="w-fit mx-auto" data={str} block />
				{/each}
			{/if}
		{/key}
		{#if !result}
			<p class="text-center text-sm text-muted-foreground">Please enter the points</p>
		{/if} -->
	</Card.Content>
</Card.Root>
