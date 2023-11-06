<script lang="ts">
	import Icon from '@iconify/svelte';

	import { formatMatrix, formatVector } from '$lib/components/kaTeX';
	import KaTeX from '$lib/components/KaTex.svelte';
	import LinearAlgebraInput from '$lib/components/linearAlgebraInput.svelte';
	import * as Card from '$lib/components/ui/card';
	import SolutionLayout from '$lib/solutions/solution-layout/solution-layout.svelte';

	import store from './lu-decomposition-store';

	function createEmptyLUMatrix(size: number, type: 'L' | 'U' | 'A'): string {
		let str = '';
		for (let i = 0; i < size; i++) {
			for (let j = 0; j < size; j++) {
				if (type === 'L') {
					if (i >= j) str += `l_{${i + 1}${j + 1}}`;
					else str += '0';
				}

				if (type === 'U') {
					if (i < j) str += `u_{${i + 1}${j + 1}}`;
					else str += '1';
				}

				if (type === 'A') {
					str += `a_{${i + 1}${j + 1}}`;
				}

				if (j != size - 1) str += '&';
			}

			str += '\\\\';
		}
		return `\\begin{bmatrix} ${str} \\end{bmatrix}`;
	}
</script>

<SolutionLayout let:C solutionType="LU_DECOMPOSITION">
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
					{@const n = $store.input.matrixSize}
					{@const precision = 6}
					<KaTeX
						data={`
							\\text{LU Decomposition } [L][U] = [A];
						`}
						class="w-fit mx-auto"
						block
					/>
					<KaTeX
						data={`
							${createEmptyLUMatrix(n, 'L')}
							${createEmptyLUMatrix(n, 'U')}
							=
							${createEmptyLUMatrix(n, 'A')}
						`}
						class="w-fit mx-auto"
						block
					/>
					<KaTeX
						data={`
							\\text{After some dark magic, we get:}
						`}
						class="w-fit mx-auto"
						block
					/>
					<KaTeX
						data={`
							\\therefore 
							${formatMatrix(result.matrixL)}
							${formatMatrix(result.matrixU)}
							=
							${formatMatrix($store.input.matrixA)}
						`}
						class="w-fit mx-auto"
						block
					/>
					<KaTeX
						data={`
							\\text{From }[L]\\{Y\\} = \\{B\\};
						`}
						class="w-fit mx-auto"
						block
					/>
					<KaTeX
						data={`
							${formatMatrix(result.matrixL)}
							${formatVector(
								Array(n)
									.fill(0)
									.map((_, i) => `y_{${i + 1}}`)
							)}
							= 
							${formatVector($store.input.arrayB)}
						`}
						class="w-fit mx-auto"
						block
					/>
					<KaTeX
						data={`
							\\text{Back substitution, we get:}
						`}
						class="w-fit mx-auto !pb-0"
						block
					/>
					<KaTeX
						data={`
							\\begin{aligned}
								${result.arrayY.map((y, i) => `y_{${i + 1}} & = ${parseFloat(y.toFixed(precision))}									`).join('\\\\')}
							\\end{aligned}
						`}
						class="w-fit mx-auto !pt-2"
						block
					/>
					<KaTeX
						data={`
							\\text{From }[U]\\{x\\} = \\{Y\\};
						`}
						class="w-fit mx-auto"
						block
					/>
					<KaTeX
						data={`
							${formatMatrix(result.matrixU)}
							${formatVector(
								Array(n)
									.fill(0)
									.map((_, i) => `x_{${i + 1}}`)
							)}
							= 
							${formatVector(result.arrayY)}
						`}
						class="w-fit mx-auto"
						block
					/>
					<KaTeX
						data={`
							\\text{Back substitution, we get:}
						`}
						class="w-fit mx-auto !pb-0"
						block
					/>
					<KaTeX
						data={`
							\\therefore
							(${Array(n)
								.fill(0)
								.map((_, i) => `x_{${i + 1}}`)
								.join(', ')})
							=
							(${result.result.map((x) => parseFloat(x.toFixed(precision))).join(', ')})
						`}
						class="w-fit mx-auto !pt-2"
						block
					/>
				{:else}
					<p class="text-center text-sm text-muted-foreground py-8">Please enter the matrix</p>
				{/if}
			</Card.Content>
		</Card.Root>
	</C.Result>
</SolutionLayout>
