<script lang="ts">
	import Icon from '@iconify/svelte';

	import Graph from '$lib/components/graph.svelte';
	import { formatVector } from '$lib/components/kaTeX';
	import KaTeX from '$lib/components/KaTex.svelte';
	import LinearAlgebraInput from '$lib/components/linearAlgebraInput.svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import * as Tabs from '$lib/components/ui/tabs';
	import SolutionLayout from '$lib/solutions/solution-layout/solution-layout.svelte';

	import store from './conjugate-gradient-store';
</script>

<SolutionLayout let:C solutionType="CONJUGATE_GRADIENT_METHOD">
	<C.Input>
		<LinearAlgebraInput
			bind:matrixA={$store.input.matrixA}
			bind:matrixB={$store.input.arrayB}
			bind:matrixX={$store.input.arrayX}
			bind:matrixSize={$store.input.matrixSize}
			bind:epsilon={$store.input.epsilon}
			onClickCalculate={() => store.fetchSolution()}
			openMethod={true}
		/>
	</C.Input>
	<C.Result>
		{#key $store.graphContour}
			<Card.Root class="mt-12">
				<Card.Content class="py-5">
					<KaTeX data={'\\text{Contour Graph}'} class="pl-6" block />
					<Graph
						graphData={[
							{
								x: $store.graphContour.x,
								y: $store.graphContour.y,
								z: $store.graphContour.z,
								type: 'contour'
							}
						]}
					/>
				</Card.Content>
			</Card.Root>
		{/key}

		<Tabs.Root value="table" class="w-full mt-12">
			<Tabs.List>
				<Tabs.Trigger value="table">Table</Tabs.Trigger>
				<Tabs.Trigger value="solution">Solution</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="table">
				<Card.Root class="">
					<Card.Content class="py-5">
						<KaTeX data={'\\text{Table}'} class="pl-6" block />
						{#if $store.loading}
							<div class="w-full flex justify-center py-16">
								<Icon icon="eos-icons:loading" class="text-center text-6xl text-primary" />
							</div>
						{:else}
							{@const iterations = $store.result?.iterations}
							<Table.Root>
								<Table.Caption>
									{#if iterations != undefined}
										Total number of iterations: {iterations.length}
									{:else}
										Please enter the matrix
									{/if}
								</Table.Caption>
								<Table.Header>
									<Table.Row>
										<Table.Head class="w-12">
											<KaTeX data="\text&lcub;iter&rcub;" />
										</Table.Head>
										<Table.Head>
											<KaTeX data="\lambda_&lcub;k-1&rcub;" />
										</Table.Head>
										<Table.Head>
											<KaTeX data="D_&lcub;k-1&rcub;" />
										</Table.Head>
										<Table.Head>
											<KaTeX data="X_k" />
										</Table.Head>
										<Table.Head>
											<KaTeX data="R_k" />
										</Table.Head>
										<Table.Head class="w-12">
											<KaTeX data="error_k" />
										</Table.Head>
									</Table.Row>
								</Table.Header>
								<Table.Body>
									{#if iterations}
										{@const precision = 6}
										{#each iterations as it}
											<Table.Row class="py-8">
												<Table.Cell>
													<KaTeX data={it.iter.toString()} />
												</Table.Cell>
												<Table.Cell>
													<KaTeX data={Number(it.lk_1).toFixed(6)} />
												</Table.Cell>
												<Table.Cell>
													<KaTeX data={formatVector(it.dk_1)} />
												</Table.Cell>
												<Table.Cell>
													<KaTeX data={formatVector(it.xk)} />
												</Table.Cell>
												<Table.Cell>
													<KaTeX data={formatVector(it.rk)} />
												</Table.Cell>
												<Table.Cell>
													<KaTeX data={it.ek.toFixed(6)} />
												</Table.Cell>
											</Table.Row>
										{/each}
									{/if}
								</Table.Body>
							</Table.Root>
						{/if}
					</Card.Content>
				</Card.Root>
			</Tabs.Content>
			<Tabs.Content value="solution">
				<Card.Root class="">
					<Card.Content class="py-5">
						<KaTeX data={'\\text{Solution}'} class="pl-6" block />
						{#if $store.loading}
							<div class="w-full flex justify-center py-16">
								<Icon icon="eos-icons:loading" class="text-center text-6xl text-primary" />
							</div>
						{:else if $store.result}
							{@const precision = 6}

							<p class="text-center">🤔🤔🤔</p>
						{:else}
							<p class="text-center text-sm text-muted-foreground py-8">Please enter the matrix</p>
						{/if}
					</Card.Content>
				</Card.Root>
			</Tabs.Content>
		</Tabs.Root>
	</C.Result>
</SolutionLayout>
