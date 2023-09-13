<script lang="ts">
    
</script>

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
					bind:value={matrixX[i]}
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