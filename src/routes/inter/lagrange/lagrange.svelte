<script lang="ts">
	import * as Card from '$lib/components/ui/card';

	import InterpolationInput from '$lib/components/interpolationInput.svelte';

	let pointSize = 3;

	let xValue: number;
	let points: {
		[key: number]: {
			x: number;
			y: number;
		};
	} = {};
	export let selectedPoint: number[] = [];

	$: console.log({
		pointSize,
		xValue,
		points,
		selectedPoint
	});
</script>

<svelte:head>
	<title>Lagrange Interpolation</title>
</svelte:head>

<h3 class="text-center">🥹 Lagrange Interpolation</h3>

<InterpolationInput
	bind:points
	bind:xValue
	bind:pointSize
	bind:selectedPoint
	onClickCalculate={(e) => console.log(e)}
/>

<Card.Root class="mt-12">
	<Card.Content class="py-5">
		<!-- <KaTex data={'\\text{Solution}'} class="pl-6" block />
		{#if loading}
			<div class="w-full flex justify-center py-16">
				<Icon icon="eos-icons:loading" class="text-center text-6xl text-primary" />
			</div>
		{/if}
		{#key result}
			{#if result}
				{@const precision = 6}
				<KaTex class="w-fit mx-auto" data={formatResult(result, precision)} block />
				<KaTex class="w-fit mx-auto" data={`f(${result.xValue}) = ${result.result}`} block />
			{/if}
		{/key} -->
	</Card.Content>
</Card.Root>
