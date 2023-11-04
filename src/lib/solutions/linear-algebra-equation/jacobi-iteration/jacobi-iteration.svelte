<script lang="ts">
	import Icon from '@iconify/svelte';

	import KaTeX from '$lib/components/KaTex.svelte';
	import LinearAlgebraInput from '$lib/components/linearAlgebraInput.svelte';
	import * as Card from '$lib/components/ui/card';
	import SolutionLayout from '$lib/solutions/solution-layout/solution-layout.svelte';
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Table from '$lib/components/ui/table';

	import store from './jacobi-iteration-store';
	import { formatVector } from '$lib/components/kaTeX';
</script>

<SolutionLayout let:C solutionType="JACOBI_ITERATION_METHOD">
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
									<Table.Head class="w-12">
										<KaTeX data="\text&lcub;iter&rcub;" />
									</Table.Head>
									<Table.Head>
										<KaTeX data="x_k" />
									</Table.Head>
									<Table.Head>
										<KaTeX data="error\%" />
									</Table.Head>
								</Table.Header>
								<Table.Body>
									{#if iterations}
										{@const precision = 6}
										{#each iterations as it, idx}
											<Table.Row>
												<Table.Cell>{idx}</Table.Cell>
												<Table.Cell>
													<KaTeX
														data={`
															${it.x
																.map((x, idx) => {
																	return `x_{${idx + 1}} = ${x}\\\\`;
																})
																.join('')}
														`}
													/>
												</Table.Cell>
												<Table.Cell>
													<KaTeX
														data={`
														${it.error
															.map((err, idx) => {
																let errStr = '';
																if (err == null) errStr = '\\infty';
																else errStr = err.toString();

																return `e_{${idx + 1}} = ${errStr}\\\\`;
															})
															.join('')}
													`}
													/>
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
