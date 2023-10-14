<script lang="ts">
	import KaTex from '$lib/components/KaTex.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';

	export let onClickCalculate: (e: MouseEvent) => void;
	export let xStart: number | string;
	export let formula = '';
	export let errorFactor = 0.000001;
</script>

<Card.Root class="">
	<Card.Content class="py-0 px-8">
		{#key formula}
			<KaTex
				block
				data={`f(x) = ${formula || '...'}`}
				class="mx-auto w-fit text-3xl max-w-full overflow-x-auto"
			/>
		{/key}
	</Card.Content>
</Card.Root>

<div class="flex items-end justify-center gap-2 mt-6">
	<Label class="">
		X Initial
		<Input class="bg-white h-11 w-36 mt-2" type="number" bind:value={xStart} placeholder="0.01" />
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
		<KaTex data={`f(x)`} />
		<Input
			class="bg-white h-11 w-48 mt-1"
			type="text"
			bind:value={formula}
			placeholder="(1+43x)/86"
		/>
	</Label>
	<Button class="h-11" on:click={onClickCalculate}>Calculate!</Button>
</div>
