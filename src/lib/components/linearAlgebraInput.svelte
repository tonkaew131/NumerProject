<script lang="ts">
	import Icon from '@iconify/svelte';

	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { createArray, createMatrix } from '$lib/utils';

	export let matrixSize = 3;
	export let matrixA = createMatrix(matrixSize);
	$: matrixA = createMatrix(matrixSize);
	export let matrixB = createArray(matrixSize);
	$: matrixB = createArray(matrixSize);

	export let onClickCalculate: (e: MouseEvent) => void;

	function onMatrixAInput(e: InputEvent, idx: number) {
		const target = e.target as HTMLInputElement;
		const value = Number(target.value);

		const row = Math.floor(idx / matrixSize);
		const col = idx % matrixSize;
		matrixA[row][col] = value;
		return;
	}
	function onMatrixBInput(e: InputEvent, idx: number) {
		const target = e.target as HTMLInputElement;
		const value = Number(target.value);

		matrixB[idx] = value;
		return;
	}
</script>

<div class="flex items-end gap-2 mx-auto w-fit">
	<Label>
		Matrix size (NxN)
		<Input
			bind:value={matrixSize}
			type="number"
			min="1"
			class="w-40 placeholder:text-gray-300 bg-white mt-2"
		/>
	</Label>
	<Button variant="destructive" size="icon">
		<Icon icon="bx:reset" class="text-xl" />
	</Button>
	<Button class="mt-2" on:click={onClickCalculate}>Calculate!</Button>
</div>

<div class="flex items-center gap-2 mt-2 justify-center">
	<Label class="text-center">
		[A]
		<div
			class="grid auto-cols-auto gap-1 mt-2"
			style={`grid-template-columns: repeat(${matrixSize}, minmax(0, 5rem));`}
		>
			{#each Array(Math.pow(matrixSize, 2)) as _, i (`matrix_a_${i}`)}
				<Input
					on:input={(e) => onMatrixAInput(e, i)}
					class="h-20 w-20 text-center placeholder:text-gray-300 bg-white"
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
				<Input
					placeholder={`x${i + 1}`}
					class="h-20 w-20 text-center placeholder:text-gray-300 bg-white"
					disabled
				/>
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
				<Input
					on:input={(e) => onMatrixBInput(e, i)}
					class="h-20 w-20 text-center placeholder:text-gray-300 bg-white"
					placeholder={`b${i + 1}`}
				/>
			{/each}
		</div>
	</Label>
</div>
