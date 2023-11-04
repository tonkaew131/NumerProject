<script lang="ts">
	import Icon from '@iconify/svelte';

	import KaTeX from '$lib/components/KaTex.svelte';
	import LinearAlgebraInput from '$lib/components/linearAlgebraInput.svelte';
	import * as Card from '$lib/components/ui/card';
	import SolutionLayout from '$lib/solutions/solution-layout/solution-layout.svelte';

	import store from './matrix-inversion-store';
	import { formatMatrix, formatVector } from '$lib/components/kaTeX';
</script>

<SolutionLayout let:C solutionType="MATRIX_INVERSION">
	<C.Input>
		<LinearAlgebraInput
			bind:matrixA={$store.input.matrixA}
			bind:matrixB={$store.input.arrayB}
			bind:matrixSize={$store.input.matrixSize}
			onClickCalculate={() => store.fetchSolution()}
		/>
	</C.Input>
	<C.Result>
		<Card.Root class="w-full mt-12">
			<Card.Content class="py-5">
				<KaTeX data={'\\text{Solution}'} class="pl-6" block />
				{#if $store.loading}
					<div class="w-full flex justify-center py-16">
						<Icon icon="eos-icons:loading" class="text-center text-6xl text-primary" />
					</div>
				{:else if $store.result}
					{@const result = $store.result}
					{@const precision = 6}
					<KaTeX
						data={`
							\\begin{aligned}
								\\text{From } Ax = B \\\\
								A^{-1}B = x
							\\end{aligned}
						`}
						class="w-fit mx-auto"
						block
					/>
					<KaTeX
						data={`
							${formatMatrix(result.matrix)}
							${formatVector($store.input.arrayB)}
							=
							${formatVector(result.result.map((_, idx) => `x_{${idx + 1}}`))}
						`}
						class="w-fit mx-auto"
						block
					/>
					<KaTeX
						data={`
							\\therefore
							(${result.result.map((_, idx) => `x_{${idx + 1}}`).join(', ')})
							= (${result.result.map((x) => parseFloat(x.toFixed(precision))).join(', ')})
						`}
						class="w-fit mx-auto"
						block
					/>
				{:else}
					<p class="text-center text-sm text-muted-foreground py-8">Please enter the matrix</p>
				{/if}
			</Card.Content>
		</Card.Root>
	</C.Result>
</SolutionLayout>
