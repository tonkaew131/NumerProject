<script lang="ts">
	import LinearAlgebraInput from '$lib/components/linearAlgebraInput.svelte';
	import * as Card from '$lib/components/ui/card';
	import SolutionLayout from '$lib/solutions/solution-layout/solution-layout.svelte';
	import modalStore from '$lib/solutions/solution-layout/solution-layout-modal-store';

	let inputData = {
		matrixA: [
			[1, 2, 3],
			[4, 5, 6],
			[7, 8, 9]
		],
		arrayB: [1, 2, 3],
		matrixSize: 3
	};

	function computeResult() {
		modalStore.set('Hello', 'World!');
	}
</script>

<SolutionLayout let:C problemType="Linear Algebra Equation" solutionType="Matrix Inversion">
	<C.Input>
		<LinearAlgebraInput
			bind:matrixA={inputData.matrixA}
			bind:matrixB={inputData.arrayB}
			bind:matrixSize={inputData.matrixSize}
			onClickCalculate={() => computeResult()}
		/>
	</C.Input>
	<C.Result>
		<Card.Root class="w-full mt-12">
			<Card.Content class="py-5">Hello World!</Card.Content>
		</Card.Root>
	</C.Result>
</SolutionLayout>
