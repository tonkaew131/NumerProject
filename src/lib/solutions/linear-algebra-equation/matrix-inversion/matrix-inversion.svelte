<script lang="ts">
	import Icon from '@iconify/svelte';

	import KaTeX from '$lib/components/KaTex.svelte';
	import LinearAlgebraInput from '$lib/components/linearAlgebraInput.svelte';
	import * as Card from '$lib/components/ui/card';
	import SolutionLayout from '$lib/solutions/solution-layout/solution-layout.svelte';

	import store from './matrix-inversion-store';
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
				{/if}
			</Card.Content>
		</Card.Root>
	</C.Result>
</SolutionLayout>
