<script lang="ts">
	import KaTex from '$lib/components/KaTex.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';

	export let onClickCalculate: (e: MouseEvent) => void;
	export let x0: number | string;
	export let x1: number | string;
	export let formula = '';
	export let errorFactor = 0.000001;
</script>

<Card.Root class="">
	<Card.Content class="py-0 px-8">
		{#key formula}
			<KaTex
				block
				data={`f(x) = ${formula.replaceAll('x', 'x_{n}') || '...'}`}
				class="mx-auto w-fit text-3xl max-w-full overflow-x-auto"
			/>
		{/key}
	</Card.Content>
</Card.Root>

<div class="flex items-end justify-center gap-2 mt-6">
	<Label class="mt-1">
		<KaTex data={`x_{0}`} />
		<Input class="bg-white h-11 w-24 mt-2" type="number" bind:value={x0} placeholder="1.00" />
	</Label>
	<Label class="mt-1">
		<KaTex data={`x_{1}`} />
		<Input class="bg-white h-11 w-24 mt-2" type="number" bind:value={x1} placeholder="1.00" />
	</Label>
	<Label class="">
		Error threshold <KaTex data={'\\epsilon'} />
		<Input
			class="bg-white h-11 w-36 mt-2"
			type="number"
			bind:value={errorFactor}
			placeholder="0.00001"
		/>
	</Label>
</div>

<div class="flex items-end justify-center gap-2 mt-1">
	<Label class="mt-1">
		<KaTex data={`x_{n+1}=`} />
		<Input class="bg-white h-11 w-60 mt-1" type="text" bind:value={formula} placeholder="x^2-7" />
	</Label>
	<Button class="h-11" on:click={onClickCalculate}>Calculate!</Button>
</div>
