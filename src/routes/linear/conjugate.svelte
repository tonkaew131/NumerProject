<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import * as Table from '$lib/components/ui/table';
	import * as Card from '$lib/components/ui/card';
	import * as Tabs from '$lib/components/ui/tabs';

	import KaTeX from '$lib/components/kaTeX.svelte';

	import Icon from '@iconify/svelte';

	import { conjugateGradientMethods, type ConjugateType } from '$lib/solutions/conjugate';
	import { formatMatrix } from '$lib/components/kaTeX';

	let result: ConjugateType = conjugateGradientMethods(
		[
			[5, 2, 0, 0],
			[2, 5, 2, 0],
			[0, 2, 5, 2],
			[0, 0, 2, 5]
		],
		[12, 17, 14, 7],
		[0, 0, 0, 0],
		0.001
	);

	const createMatrix = (matrixSize: number) => {
		const matrix = new Array(Number(matrixSize));
		for (let i = 0; i < matrixSize; i++) {
			matrix[i] = new Array(Number(matrixSize));
		}
		return matrix;
	};

	const createArray = (matrixSize: number) => {
		const array = new Array(Number(matrixSize));
		return array;
	};

	let matrixSize: number = 3;
	let matrixA = createMatrix(matrixSize);
	$: matrixA = createMatrix(matrixSize);
	let matrixB = createArray(matrixSize);
	$: matrixB = createArray(matrixSize);
	let matrixX = createArray(matrixSize);
	$: matrixX = createArray(matrixSize);

	// $: console.log({ matrixA, matrixB, matrixX });

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

<h3 class="text-center">🥹 Conjugate Gradient Methods</h3>

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
	<Button variant="destructive" size="icon">
		<Icon icon="bx:reset" class="text-xl" />
	</Button>
	<Button class="mt-2">Calculate!</Button>
</div>

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

<Tabs.Root value="table" class="w-full pb-24 mt-12 overflow-auto">
	<Tabs.List>
		<Tabs.Trigger value="table">Table</Tabs.Trigger>
		<Tabs.Trigger value="solution">Solution</Tabs.Trigger>
	</Tabs.List>
	<Tabs.Content value="table">
		<Card.Root class="w-full">
			<Card.Content>
				<Table.Root>
					<Table.Caption>Total number of rounds: {result.iterations.length}</Table.Caption>
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
						{#each result.iterations as it}
							<Table.Row class="py-8">
								<Table.Cell>
									<KaTeX data={it.iter.toString()} />
								</Table.Cell>
								<Table.Cell>
									<KaTeX data={Number(it.lk_1).toFixed(6)} />
								</Table.Cell>
								<Table.Cell>
									<KaTeX data={formatMatrix(it.dk_1)} />
								</Table.Cell>
								<Table.Cell>
									<KaTeX data={formatMatrix(it.xk)} />
								</Table.Cell>
								<Table.Cell>
									<KaTeX data={formatMatrix(it.rk)} />
								</Table.Cell>
								<Table.Cell>
									<KaTeX data={it.ek.toFixed(6)} />
								</Table.Cell>
							</Table.Row>
						{/each}
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

<div class="font-mono whitespace-break-spaces mt-2">
	{JSON.stringify(result, null, 4)}
</div>
