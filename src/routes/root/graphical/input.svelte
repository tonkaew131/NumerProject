<script lang="ts">
	import KaTex from '$lib/components/KaTex.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';

	export let onClickCalculate: (e: MouseEvent) => void;
	export let xStart: number;
	export let xEnd: number;
	export let formula: string = '';
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
		X Start
		<Input class="bg-white h-11 w-20 mt-2" type="number" bind:value={xStart} placeholder="0.00" />
	</Label>
	<Label class="">
		X End
		<Input class="bg-white h-11 w-20 mt-2" type="number" bind:value={xEnd} placeholder="7.00" />
	</Label>
	<Label class="">
		Error threshold <KaTex data={'\\epsilon'} />
		<Input class="bg-white h-11 w-32 mt-2" type="number" bind:value={xEnd} placeholder="0.00001" />
	</Label>
</div>

<div class="flex items-end justify-center gap-2 mt-1">
	<Label class="">
		f(x)
		<Input class="bg-white h-11 w-48 mt-2" type="text" bind:value={formula} placeholder="43x-1" />
	</Label>
	<Button class="h-11" on:click={onClickCalculate}>Calculate!</Button>
</div>
