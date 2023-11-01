<script lang="ts">
	import LinearAlgebraInput from '$lib/components/linearAlgebraInput.svelte';
	import SolutionLayout from '$lib/solutions/solution-layout/solution-layout.svelte';
	import * as Card from '$lib/components/ui/card';

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
		toggleModal('hi', 'me');
	}

	let modalMessage = {
		title: '',
		description: ''
	};
	function toggleModal(title: string, description: string) {
		modalMessage = {
			title,
			description
		};
		document?.getElementById('trigger-modal')!.click();
	}
</script>

<SolutionLayout
	let:C
	{modalMessage}
	problemType="Linear Algebra Equation"
	solutionType="Matrix Inversion"
>
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
