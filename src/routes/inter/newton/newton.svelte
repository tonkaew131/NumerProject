<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import * as Card from '$lib/components/ui/card';

	import Icon from '@iconify/svelte';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import Toggle from '$lib/components/ui/toggle/toggle.svelte';
	import KaTex from '$lib/components/KaTex.svelte';

	let pointSize = 3;
</script>

<svelte:head>
	<title>Newton's Divided Difference</title>
	<meta name="description" content="Newton's Divided Difference" />
</svelte:head>

<h3 class="text-center">🥹 Newton's Divided Difference</h3>

<Label>
	Number of points 🫵
	<div class="flex gap-1 mt-2">
		<Button
			class="bg-red-500 hover:bg-red-500/90 h-11 w-11"
			on:click={() => (pointSize <= 1 ? null : pointSize--)}
		>
			<Icon icon="ic:baseline-minus" />
		</Button>
		<Input
			type="number"
			class="h-11 w-20 bg-white"
			placeholder="3"
			min="1"
			bind:value={pointSize}
		/>
		<Button class="bg-green-500 hover:bg-green-500/90 h-11 w-11" on:click={() => pointSize++}>
			<Icon icon="ic:baseline-plus" />
		</Button>
	</div>
</Label>

<Label class="flex items-end gap-2 mt-2">
	<div>
		X value
		<Input placeholder="0.00" class="bg-white mt-2" />
	</div>
	<Button class="">Calculate!</Button>
</Label>

<Card.Root class="w-fit mt-2">
	<Card.Content class="w-fit py-5">
		<div class="flex flex-col gap-1 w-fit">
			{#each Array(pointSize) as _, idx}
				<div class="flex items-center gap-1 w-fit">
					<Checkbox />
					<span class="w-8 text-center">
						{idx + 1}.
					</span>
					<Input type="number" class="w-48 bg-white" placeholder={`x${idx}`} />
					<Input type="number" class="w-48 bg-white" placeholder={`f(x${idx})`} />
				</div>
			{/each}
		</div>
		<Toggle variant="outline" class="mt-2">Toggle all</Toggle>
	</Card.Content>
</Card.Root>

<Card.Root class="mt-12">
	<Card.Content class="py-5">
		<KaTex data={'\\text{Solution}'} class="pl-6" block />
	</Card.Content>
</Card.Root>
