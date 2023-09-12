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
	<Label class="text-center">
		[A]
		<div
			class="grid auto-cols-auto gap-1 mt-2"
			style={`grid-template-columns: repeat(${matrixSize}, minmax(0, 5rem));`}
		>
			{#each Array(Math.pow(matrixSize, 2)) as _, i (`matrix_a_${i}`)}
				<Input
					class="h-20 w-20 text-center"
					placeholder={`a${Math.floor(i / matrixSize) + 1}${(i % matrixSize) + 1}`}
				/>
			{/each}
		</div>
	</Label>

	<Label class="text-center"
		>&lcub;X&rcub;
		<div
			class="grid auto-cols-auto gap-1 mt-2"
			style="grid-template-columns: repeat(1, minmax(0, 5rem));"
		>
			{#each Array(Number(matrixSize)) as _, i (`matrix_x_${i}`)}
				<Input class="h-20 w-20 text-center" disabled value={`x${i + 1}`} />
			{/each}
		</div>
	</Label>

	<p>=</p>

	<Label class="text-center"
		>&lcub;B&rcub;
		<div
			class="grid auto-cols-auto gap-1 mt-2"
			style="grid-template-columns: repeat(1, minmax(0, 5rem));"
		>
			{#each Array(Number(matrixSize)) as _, i (`matrix_b_${i}`)}
				<Input class="h-20 w-20 text-center" placeholder={`b${i + 1}`} />
			{/each}
		</div>
	</Label>
</div>

<Label>
	Intial value
	<div
		class="grid auto-cols-auto gap-1"
		style={`grid-template-columns: repeat(${matrixSize}, minmax(0, 5rem));`}
	>
		{#each Array(Number(matrixSize)) as _, i (`initial_x_${i}`)}
			<Input class="h-20 w-20 text-center" placeholder={`x${i + 1}`} />
		{/each}
	</div>
</Label>

<Button>Calculate!</Button>
