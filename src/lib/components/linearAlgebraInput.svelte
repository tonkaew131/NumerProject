<script lang="ts">
	import Icon from '@iconify/svelte';

	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { createArray, createMatrix } from '$lib/utils';

	import KaTeX from './KaTex.svelte';

	export let matrixSize = 3;
	export let matrixA = createMatrix(matrixSize);
	$: matrixA = createMatrix(matrixSize);
	export let matrixB = createArray(matrixSize);
	$: matrixB = createArray(matrixSize);
	export let matrixX = createArray(matrixSize);
	$: matrixX = createArray(matrixSize);
	export let epsilon = 0.000001;

	export let openMethod = false;

	export let onClickCalculate: (e: MouseEvent) => void;

	function onClickReset() {
		matrixA = createMatrix(matrixSize);
		matrixB = createArray(matrixSize);
		matrixX = createArray(matrixSize);

		const inputs = document.getElementsByClassName('matrix-input');
		for (let i = 0; i < inputs.length; i++) {
			const el = inputs[i];
			(el as HTMLInputElement).value = '';
		}
		return;
	}

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
	function onMatrixXInput(e: InputEvent, idx: number) {
		const target = e.target as HTMLInputElement;
		const value = Number(target.value);

		matrixX[idx] = value;
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
	<Button variant="destructive" size="icon" on:click={onClickReset}>
		<Icon icon="bx:reset" class="text-xl" />
	</Button>
	<Button class="mt-2" on:click={onClickCalculate}>Calculate!</Button>
</div>

<div class="flex items-end gap-2 mx-auto w-fit mt-1">
	<Label>
		<KaTeX data="\varepsilon" />
		<Input
			bind:value={epsilon}
			type="number"
			class="w-[19rem] placeholder:text-gray-300 bg-white mt-1"
		/>
	</Label>
</div>

<div class="flex items-center gap-2 mt-2 justify-center">
	<Label class="text-center">
		<KaTeX data="[A]" />
		<div
			class="grid auto-cols-auto gap-1 mt-2"
			style={`grid-template-columns: repeat(${matrixSize}, minmax(0, 5rem));`}
		>
			{#each Array(Math.pow(matrixSize, 2)) as _, i (`matrix_a_${i}`)}
				<Input
					on:input={(e) => onMatrixAInput(e, i)}
					class="h-20 w-20 text-center placeholder:text-gray-300 bg-white matrix-input"
					placeholder={`a${Math.floor(i / matrixSize) + 1}${(i % matrixSize) + 1}`}
				/>
			{/each}
		</div>
	</Label>

	<Label class="text-center">
		<KaTeX data={`\\{x\\}`} />
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

	<p><KaTeX data="=" /></p>

	<Label class="text-center">
		<KaTeX data={`\\{B\\}`} />
		<div
			class="grid auto-cols-auto gap-1 mt-2"
			style="grid-template-columns: repeat(1, minmax(0, 5rem));"
		>
			{#each Array(Number(matrixSize)) as _, i (`matrix_b_${i}`)}
				<Input
					on:input={(e) => onMatrixBInput(e, i)}
					class="h-20 w-20 text-center placeholder:text-gray-300 bg-white matrix-input"
					placeholder={`b${i + 1}`}
				/>
			{/each}
		</div>
	</Label>
</div>

{#if openMethod}
	<div class="flex items-center gap-2 mt-4 justify-center">
		<Label class="text-center">
			<KaTeX data={`\\{X\\}^0`} />
			<div class="flex gap-1 mt-2" style="grid-template-columns: repeat(1, minmax(0, 5rem));">
				{#each Array(Number(matrixSize)) as _, i (`matrix_b_${i}`)}
					<Input
						on:input={(e) => onMatrixXInput(e, i)}
						class="h-20 w-20 text-center placeholder:text-gray-300 bg-white matrix-input"
						placeholder={`x${i + 1}`}
					/>
				{/each}
			</div>
		</Label>
	</div>
{/if}
