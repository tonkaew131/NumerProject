<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';

	let matrixSize: number = 3;
</script>

<h3 class="">🥹 Conjugate Gradient Methods</h3>

<Label>
	Matrix size (NxN)
	<Input bind:value={matrixSize} type="number" min="1" class="w-40" />
</Label>

<Label>
	Matrix A
	<div>
		{#each Array.from(Array(10).keys()) as i}
			<Input class="aspect-square"/>
		{/each}
	</div>
</Label>
