<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';

	import * as Select from '$lib/components/ui/select';
	import Conjugate from './linear/conjugate.svelte';
	import Guass from './linear/guass.svelte';

	let mode: string = '';
	let solutionMode: string = '';
	let precision: number = 6;

	function onChangeProblemType(e) {
		const value = e?.value;
		if (value == undefined) mode = '';
		else mode = String(value);

		solutionMode = '';
	}
</script>

<svelte:head>
	<title>Numerical methods calculator</title>
	<meta
		name="description"
		content="Numerical methods calculator made with love (for score) by @tonkaew131"
	/>
</svelte:head>

<div class="prose max-w-6xl mx-auto pt-16 pb-48 w-11/12">
	<h1 class="text-center w-fit mx-auto">
		Project of Numerical methods
		<div class="h-[2px] w-full bg-primary my-2 rounded-full" />
	</h1>

	<div class="flex gap-4 items-center flex-wrap justify-center">
		<Label class="flex items-center gap-2">
			Type of Problem:
			<Select.Root onSelectedChange={onChangeProblemType}>
				<Select.Trigger class="w-64 bg-white">
					<Select.Value placeholder="-" />
				</Select.Trigger>
				<Select.Content>
					<Select.Item value="root">Root of Equation</Select.Item>
					<Select.Item value="linear">Linear algebra equation</Select.Item>
					<Select.Item value="inter_extra">Interpolation and Extrapolation</Select.Item>
				</Select.Content>
			</Select.Root>
		</Label>

		<Label class="flex flex-wrap items-center gap-2">
			Solution:
			<Select.Root
				onSelectedChange={(e) => {
					const value = e?.value;
					if (value == undefined) solutionMode = '';
					else solutionMode = String(value);
				}}
			>
				<Select.Trigger class="w-64 bg-white">
					<Select.Value placeholder="-" />
				</Select.Trigger>
				<Select.Content>
					{#if mode === 'root'}
						<!-- <Select.Item value="root">Root of Equation</Select.Item> -->
					{:else if mode === 'linear'}
						<Select.Item value="linear-cramer">Cramer's rule</Select.Item>
						<Select.Item value="linear-guass">Guass elimination</Select.Item>
						<Select.Item value="linear-jordan">Guass Jordan elimination</Select.Item>
						<Select.Item value="linear-inversion">Matrix Inversion</Select.Item>
						<Select.Item value="linear-jacobi">Jacobi Iteration Methods</Select.Item>
						<Select.Item value="linear-conjugate">Conjugate Gradient Methods</Select.Item>
					{:else if mode === 'inter_extra'}
						<!-- <Select.Item value="root">Root of Equation</Select.Item> -->
					{/if}
				</Select.Content>
			</Select.Root>
		</Label>

		<Label class="flex items-center gap-2">
			Precision:
			<Input type="number" class="w-20" placeholder="6" bind:value={precision} />
		</Label>
	</div>

	{#if solutionMode === ''}
		<p class="text-center py-16">Cool stats goes here</p>
	{:else if solutionMode === 'linear-conjugate'}
		<Conjugate />
	{:else if solutionMode === 'linear-guass'}
		<Guass precision={Number(precision)} />
	{:else}
		<p class="text-center py-16">Not implemented yet</p>
	{/if}
</div>
