<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Table from '$lib/components/ui/table';
	import * as Card from '$lib/components/ui/card';
	import * as Tabs from '$lib/components/ui/tabs';

	import KaTeX from '$lib/components/KaTex.svelte';

	import { conjugateGradientMethods, type ConjugateType } from '$lib/solutions/conjugate';
	import { formatVector } from '$lib/components/kaTeX';
	import { createArray, createMatrix } from '$lib/utils';
	import LinearAlgebraInput from '$lib/components/linearAlgebraInput.svelte';

	let result: ConjugateType;

	let matrixSize: number = 3;
	let matrixA = createMatrix(matrixSize);
	$: matrixA = createMatrix(matrixSize);
	let matrixB = createArray(matrixSize);
	$: matrixB = createArray(matrixSize);
	let matrixX = createArray(matrixSize);
	$: matrixX = createArray(matrixSize);

	let modalMessage = {
		title: '',
		description: ''
	};
	function computeResult() {
		const isArrayFill = (array: number[]) => {
			let isFill = true;
			for (let i = 0; i < matrixSize; i++) {
				if (array[i] == undefined || array[i] == null) {
					isFill = false;
					break;
				}
			}
			return isFill;
		};

		if (!isArrayFill(matrixB)) {
			modalMessage.title = 'Matrix B is empty!';
			modalMessage.description = 'Please fill every number in Matrix B';
			document.getElementById('trigger-modal')!.click();
			return;
		}

		if (!isArrayFill(matrixX)) {
			modalMessage.title = 'Matrix X is empty!';
			modalMessage.description = 'Please fill every number in Matrix X';
			document.getElementById('trigger-modal')!.click();
			return;
		}

		result = conjugateGradientMethods(matrixA, matrixB, matrixX, 0.001);
		if (result.error) {
			modalMessage.title = 'Calculation error';
			modalMessage.description = result.error;
			document.getElementById('trigger-modal')!.click();
		}

		console.log(result);
	}

	function onMatrixXInput(e: InputEvent, idx: number) {
		const target = e.target as HTMLInputElement;
		const value = Number(target.value);

		matrixX[idx] = value;
		return;
	}
</script>

<svelte:head>
	<title>Conjugate Gradient Methods</title>
	<meta name="description" content="Conjugate Gradient Methods" />
</svelte:head>

<h3 class="text-center">🥹 Conjugate Gradient Methods</h3>

<LinearAlgebraInput
	bind:matrixA
	bind:matrixB
	bind:matrixSize
	onClickCalculate={(e) => computeResult()}
/>

<Label class="text-center flex  flex-col justify-center items-center gap-2 mt-2">
	Intial value
	<div
		class="grid auto-cols-auto gap-1 w-fit mx-auto"
		style={`grid-template-columns: repeat(${matrixSize}, minmax(0, 5rem));`}
	>
		{#each Array(Number(matrixSize)) as _, i (`initial_x_${i}`)}
			<Input
				on:input={(e) => onMatrixXInput(e, i)}
				class="h-20 w-20 text-center placeholder:text-gray-300 bg-white"
				placeholder={`x${i + 1}`}
			/>
		{/each}
	</div>
</Label>

<Dialog.Root>
	<Dialog.Trigger id="trigger-modal" />
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>{modalMessage.title}</Dialog.Title>
			<Dialog.Description>
				{modalMessage.description}
			</Dialog.Description>
		</Dialog.Header>
	</Dialog.Content>
</Dialog.Root>

<Tabs.Root value="table" class="w-full mt-12 overflow-auto">
	<Tabs.List>
		<Tabs.Trigger value="table">Table</Tabs.Trigger>
		<Tabs.Trigger value="solution">Solution</Tabs.Trigger>
	</Tabs.List>
	<Tabs.Content value="table">
		<Card.Root class="w-full">
			<Card.Content>
				<Table.Root>
					<Table.Caption>
						{#if result?.iterations != undefined}
							Total number of rounds: {result.iterations.length}
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
						{#if result?.iterations != undefined}
							{#each result.iterations as it}
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
			</Card.Content>
		</Card.Root>
	</Tabs.Content>
	<Tabs.Content value="solution">
		<Card.Root class="w-full">
			<Card.Content>
				<p class="mb-0">SOLUTIONS GOES HERE</p>
			</Card.Content>
		</Card.Root>
	</Tabs.Content>
</Tabs.Root>

<Card.Root class="w-full mt-4">
	<Card.Header>
		<Card.Title class="mt-0">Contour Graph</Card.Title>
	</Card.Header>
	<Card.Content class="flex flex-col">
		{#if result?.iterations}
			<Skeleton class="w-full max-w-3xl aspect-[4_/_3] rounded-radius" />
		{:else}
			<span class="text-sm text-muted-foreground text-center w-full">Please enter the matrix</span>
		{/if}
	</Card.Content>
</Card.Root>

<!-- <div class="font-mono whitespace-break-spaces mt-2">
	{JSON.stringify(result, null, 4)}
</div> -->
