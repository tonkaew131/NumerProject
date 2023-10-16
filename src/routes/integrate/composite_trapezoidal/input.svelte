<script lang="ts">
	import KaTex from '$lib/components/KaTex.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';

	export let onClickCalculate: (e: MouseEvent) => void;
	export let xStart: number | string;
	export let xEnd: number | string;
	export let n: number | string;
	export let formula = '';
</script>

<Card.Root class="">
	<Card.Content class="py-0 px-8">
		{#key [formula, xEnd, xStart]}
			<KaTex
				block
				data={`\\color{gray} \\displaystyle 
				\\int
				^{\\color{black}${xEnd != undefined && xEnd != '' ? xEnd : 'b'}}
				_{\\color{black}${xStart != undefined && xStart != '' ? xStart : 'a'}}
				 {\\color{black}${formula || '...'}} 
				 \\space dx`}
				class="mx-auto w-fit text-3xl max-w-full overflow-x-auto"
			/>
		{/key}
	</Card.Content>
</Card.Root>

<div class="flex items-end justify-center gap-2 mt-6">
	<Label class="mt-1">
		<KaTex data={`a = x_{0}`} />
		<Input class="bg-white h-11 w-20 mt-2" type="number" bind:value={xStart} placeholder="2" />
	</Label>
	<Label class="mt-1">
		<KaTex data={`b = x_{1}`} />
		<Input class="bg-white h-11 w-20 mt-2" type="number" bind:value={xEnd} placeholder="8" />
	</Label>
	<Button class="h-11" on:click={onClickCalculate}>Calculate!</Button>
</div>

<div class="flex items-end justify-center gap-2 mt-1">
	<Label class="mt-1">
		<KaTex data={`n`} />
		<Input class="bg-white h-11 w-24 mt-2" type="number" bind:value={n} placeholder="2,4,6,..." />
	</Label>
	<Label class="mt-1">
		<KaTex data={`f(x)=`} />
		<Input
			class="bg-white h-11 w-[11rem] mt-1"
			type="text"
			bind:value={formula}
			placeholder="4x^5-3x^4+x^3-6x+2"
		/>
	</Label>
</div>
