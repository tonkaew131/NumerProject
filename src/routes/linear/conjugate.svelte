<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';

	let matrixSize: number = 3;
</script>

<h3 class="">🥹 Conjugate Gradient Methods</h3>

<Label>
	Matrix size (NxN)
	<Input bind:value={matrixSize} type="number" min="1" class="w-40" />
</Label>

<div class="flex items-center gap-2 mt-2">
	<Label>
		Matrix A
		<div
			class="grid auto-cols-auto gap-1 mt-2"
			style={`grid-template-columns: repeat(${matrixSize}, minmax(0, 3rem));`}
		>
			{#each Array.from(Array(Math.pow(matrixSize, 2)).keys()) as i}
				<Input class="h-12 w-12" />
			{/each}
		</div>
	</Label>

	<Label
		>Matrix B
		<div
			class="grid auto-cols-auto gap-1 mt-2"
			style={`grid-template-columns: repeat(${1}, minmax(0, 3rem));`}
		>
			{#each Array.from(Array(matrixSize).keys()) as i}
				<Input class="h-12 w-12" />
			{/each}
		</div>
	</Label>
</div>

<Button>Calculate!</Button>
