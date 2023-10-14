<script lang="ts">
	import Icon from '@iconify/svelte';

	import Graph from '$lib/components/graph.svelte';
	import KaTex from '$lib/components/KaTex.svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Table from '$lib/components/ui/table';
	import * as Tabs from '$lib/components/ui/tabs';
	import type { SecantResult } from '$lib/solutions/secant';
	import { secantMethod } from '$lib/solutions/secant';

	import Input from './input.svelte';
	import { evaluate } from 'mathjs';

	let inputData = {
		x0: '',
		x1: '',
		formula: '',
		errorFactor: 0.000001
	};

	let modalMessage = {
		title: '',
		description: ''
	};
	let loading = false;

	let result: SecantResult & {
		graphLine: {
			x: number[];
			y: number[];
		};
		slopeLine: {
			x: number[];
			y: number[];
		}[];
		minX: number;
		maxX: number;
	} = {
		result: 2.6457513110645907,
		iter: 7,
		iterations: [
			{
				x: 3.4,
				y: 4.559999999999999
			},
			{
				x: 3.4,
				y: 4.559999999999999
			},
			{
				x: 2.469387755102041,
				y: -0.9021241149521018
			},
			{
				x: 2.623087621696801,
				y: -0.11941132890101969
			},
			{
				x: 2.6465362041769547,
				y: 0.004153880019363676
			},
			{
				x: 2.6457479353827065,
				y: -0.000017862418146386005
			},
			{
				x: 2.6457513105639467,
				y: -2.6491582261201074e-9
			}
		],
		minX: 2.3763265306122454,
		maxX: 3.4930612244897956,
		graphLine: {
			x: [
				2.3763265306122454, 2.387493877551021, 2.3986612244897962, 2.409828571428572,
				2.4209959183673475, 2.432163265306123, 2.4433306122448983, 2.4544979591836737,
				2.4656653061224496, 2.476832653061225, 2.4880000000000004, 2.499167346938776,
				2.5103346938775513, 2.521502040816327, 2.5326693877551025, 2.543836734693878,
				2.5550040816326534, 2.5661714285714288, 2.5773387755102046, 2.58850612244898,
				2.5996734693877555, 2.610840816326531, 2.6220081632653063, 2.633175510204082,
				2.6443428571428576, 2.655510204081633, 2.6666775510204084, 2.677844897959184,
				2.6890122448979596, 2.700179591836735, 2.7113469387755105, 2.722514285714286,
				2.7336816326530613, 2.744848979591837, 2.7560163265306126, 2.767183673469388,
				2.7783510204081634, 2.789518367346939, 2.8006857142857147, 2.81185306122449,
				2.8230204081632655, 2.834187755102041, 2.8453551020408163, 2.856522448979592,
				2.8676897959183676, 2.878857142857143, 2.8900244897959184, 2.901191836734694,
				2.9123591836734697, 2.923526530612245, 2.9346938775510205, 2.945861224489796,
				2.9570285714285713, 2.968195918367347, 2.9793632653061226, 2.990530612244898,
				3.0016979591836734, 3.012865306122449, 3.0240326530612247, 3.0352, 3.0463673469387755,
				3.057534693877551, 3.0687020408163264, 3.079869387755102, 3.0910367346938776,
				3.102204081632653, 3.1133714285714285, 3.124538775510204, 3.1357061224489797,
				3.146873469387755, 3.1580408163265306, 3.169208163265306, 3.1803755102040814,
				3.1915428571428572, 3.2027102040816327, 3.213877551020408, 3.2250448979591835,
				3.236212244897959, 3.2473795918367347, 3.25854693877551, 3.2697142857142856,
				3.280881632653061, 3.2920489795918364, 3.3032163265306123, 3.3143836734693877,
				3.325551020408163, 3.3367183673469385, 3.347885714285714, 3.3590530612244898,
				3.370220408163265, 3.3813877551020406, 3.3925551020408165, 3.4037224489795914,
				3.4148897959183673, 3.4260571428571422, 3.437224489795918, 3.4483918367346935,
				3.459559183673469, 3.470726530612245, 3.48189387755102
			],
			y: [
				-1.353072219908369, -1.2998729846563908, -1.246424330129111, -1.1927262563265275,
				-1.1387787632486432, -1.084581850895458, -1.0301355192669703, -0.9754397683631808,
				-0.9204945981840869, -0.8653000087296929, -0.8098559999999981, -0.7541625719950007,
				-0.6982197247147006, -0.642027458159097, -0.5855857723281943, -0.528894667221989,
				-0.47195414284048187, -0.41476419918367213, -0.35732483625155886, -0.2996360540441456,
				-0.24169785256143062, -0.18351023180341386, -0.12507319177009535, -0.06638673246147153,
				-0.007450853877548624, 0.05173444398167604, 0.11116916111620245, 0.1708532975260315,
				0.2307868532111641, 0.29096982817159756, 0.3514022224073319, 0.41208403591836795,
				0.47301526870470667, 0.5341959207663498, 0.595625992103292, 0.657305482715536,
				0.7192343926030826, 0.781412721765931, 0.8438404702040838, 0.9065176379175357,
				0.9694442249062902, 1.0326202311703465, 1.0960456567097037, 1.159720501524367,
				1.2236447656143294, 1.2878184489795927, 1.3522415516201587, 1.4169140735360255,
				1.4818360147271985, 1.5470073751936706, 1.6124281549354436, 1.6780983539525192,
				1.7440179722448974, 1.81018700981258, 1.8766054666555618, 1.9432733427738444,
				2.0101906381674297, 2.0773573528363176, 2.14477348678051, 2.2124390400000014,
				2.2803540124947936, 2.3485184042648886, 2.416932215310286, 2.485595445630988,
				2.554508095226989, 2.623670164098293, 2.6930816522448975, 2.7627425596668047,
				2.8326528863640164, 2.902812632336527, 2.9732217975843387, 3.0438803821074547,
				3.1147883859058716, 3.185945808979593, 3.2573526513286133, 3.3290089129529363,
				3.4009145938525602, 3.4730696940274868, 3.5454742134777177, 3.618128152203248,
				3.6910315102040805, 3.764184287480216, 3.837586484031652, 3.9112380998583927,
				3.9851391349604324, 4.059289589337775, 4.133689462990418, 4.208338755918366,
				4.283237468121616, 4.358385599600165, 4.433783150354017, 4.509430120383174,
				4.5853265096876274, 4.661472318267387, 4.737867546122445, 4.81451219325281,
				4.891406259658472, 4.968549745339439, 5.045942650295709, 5.1235849745272795
			]
		}
	};

	let timeSinceLastCalculate = 0;
	let COOLDOWN_TIME = 5;
	async function computeResult() {
		if (timeSinceLastCalculate == 0) timeSinceLastCalculate = Date.now();
		else if (Date.now() - timeSinceLastCalculate < COOLDOWN_TIME * 1000) {
			const timeLeft = COOLDOWN_TIME - (Date.now() - timeSinceLastCalculate) / 1000;
			modalMessage = {
				title: 'Calculation Error!',
				description: `Please wait for ${COOLDOWN_TIME} seconds before calculating again (${timeLeft.toFixed(
					1
				)}s)`
			};

			document?.getElementById('trigger-modal')!.click();
			return;
		}

		timeSinceLastCalculate = Date.now();
		loading = true;

		const res = await fetch('/api/solution/root/secant', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				x0: inputData.x0,
				x1: inputData.x1,
				errorFactor: inputData.errorFactor,
				func: inputData.formula
			})
		});
		const jsonData = await res.json();

		loading = false;
		if (jsonData.error) {
			modalMessage = {
				title: 'Calculation Error!',
				description: jsonData.error.message
			};

			document?.getElementById('trigger-modal')!.click();
			console.log(jsonData);
		}

		if (jsonData.warning) {
			modalMessage = {
				title: 'Calculation Warning!',
				description: jsonData.warning.message
			};

			document?.getElementById('trigger-modal')!.click();
		}

		result = jsonData.data;

		const resultIterations = secantMethod(
			Number(inputData.x0),
			Number(inputData.x1),
			Number(inputData.errorFactor),
			inputData.formula
		);
		result.iterations = resultIterations.iterations;

		if (result.iterations == undefined) {
			modalMessage = {
				title: 'Calculation Warning!',
				description: 'The function is not convergent'
			};

			document?.getElementById('trigger-modal')!.click();
			return;
		}

		formatResultData();
	}

	function formatResultData() {
		if (result.iterations == undefined) return;

		result.slopeLine = [];
		result.minX = Infinity;
		result.maxX = -Infinity;
		for (let i = 0; i < result.iterations.length; i++) {
			const currIter = result.iterations[i];

			if (currIter.x < result.minX) result.minX = currIter.x;
			if (currIter.x > result.maxX) result.maxX = currIter.x;

			result.slopeLine.push({
				x: [currIter.x, result.iterations[i != result.iterations.length - 1 ? i + 1 : i].x],
				y: [currIter.y, 0]
			});
		}

		let range = result.maxX - result.minX;
		result.minX = result.minX - range * 0.1;
		result.maxX = result.maxX + range * 0.1;
		result.graphLine = {
			x: [],
			y: []
		};
		for (let i = 0; i < 100; i++) {
			const x = result.minX + (i / 100) * (result.maxX - result.minX);
			result.graphLine.x.push(x);
			result.graphLine.y.push(evaluate(inputData.formula, { x }));
		}

		// result = result;
		console.log(result);
	}
</script>

<svelte:head>
	<title>Secant methods</title>
	<meta name="description" content="Secant methods - Root of Eqation" />
</svelte:head>

<h3 class="text-center">🥹 Secant methods</h3>

<Input
	onClickCalculate={() => computeResult()}
	bind:x0={inputData.x0}
	bind:x1={inputData.x1}
	bind:formula={inputData.formula}
	bind:errorFactor={inputData.errorFactor}
/>

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

<Card.Root class="">
	<Card.Content class="py-5">
		<KaTex data={'\\text{Graph}'} class="pl-6" block />
		{#key result}
			<Graph
				graphData={[
					{
						x: result?.graphLine?.x || [],
						y: result?.graphLine?.y || [],
						mode: 'lines',
						line: {
							width: 2
						},
						name: 'f(x)'
					},
					...(result?.slopeLine || []).map((ln, idx) => {
						return {
							x: ln.x,
							y: ln.y,
							mode: 'lines+markers',
							line: {
								color: 'red',
								width: 2
							},
							marker: {
								color: 'black'
							},
							name: `f'(x${idx})`
						};
					})
				]}
			/>
		{/key}
	</Card.Content>
</Card.Root>

<Tabs.Root value="table" class="w-full mt-12">
	<Tabs.List>
		<Tabs.Trigger value="table">Table</Tabs.Trigger>
		<Tabs.Trigger value="solution">Solution</Tabs.Trigger>
	</Tabs.List>
	<Tabs.Content value="table">
		<Card.Root class="">
			<Card.Content class="py-5">
				<KaTex data={'\\text{Table}'} class="pl-6" block />
				{#if loading}
					<div class="w-full flex justify-center py-16">
						<Icon icon="eos-icons:loading" class="text-center text-6xl text-primary" />
					</div>
				{/if}
				<Table.Root>
					<Table.Caption>
						{#if result?.iterations != undefined}
							Total number of iterations: {result.iterations.length}
						{:else}
							Please enter the formula
						{/if}
					</Table.Caption>
					<Table.Header>
						<Table.Head class="w-12">
							<KaTex data="\text&lcub;iter&rcub;" />
						</Table.Head>
						<Table.Head>
							<KaTex data="x_k" />
						</Table.Head>
						<Table.Head>
							<KaTex data="y_k" />
						</Table.Head>
						<Table.Head>
							<KaTex data="error\%" />
						</Table.Head>
					</Table.Header>
					<Table.Body>
						{#if result?.iterations}
							{@const precision = 6}
							{#each result.iterations as it, idx}
								<Table.Row>
									<Table.Cell>{idx}</Table.Cell>
									<Table.Cell>{parseFloat(it.x.toFixed(precision * 2))}</Table.Cell>
									<Table.Cell>{parseFloat(it.y.toFixed(precision))}</Table.Cell>
									<Table.Cell>{parseFloat((Math.abs(it.y) * 100).toFixed(6))}%</Table.Cell>
								</Table.Row>
							{/each}
						{/if}
					</Table.Body>
				</Table.Root>
			</Card.Content>
		</Card.Root>
	</Tabs.Content>
	<Tabs.Content value="solution">
		<Card.Root class="">
			<Card.Content class="py-5">
				<KaTex data={'\\text{Solution}'} class="pl-6" block />
				{#if loading}
					<div class="w-full flex justify-center py-16">
						<Icon icon="eos-icons:loading" class="text-center text-6xl text-primary" />
					</div>
				{/if}
				<!-- {#key result}
					{#if result}
						{@const precision = 6}
						<KaTex
							class="w-fit mx-auto"
							block
							data={`f(x) = ${result.matrixB
								.map((_, idx) => `a_{${idx}} ${idx != 0 ? 'x' : ''} ${idx > 1 ? `^{${idx}}` : ''}`)
								.join('+')}
								`}
						/>
						<KaTex
							class="w-fit mx-auto"
							data={`${formatMatrix(result.matrixA, precision)}
							\\begin{Bmatrix}
							${result.matrixB.map((_, idx) => `a_{${idx}}`).join('\\\\')}
							\\end{Bmatrix}
							= 
							${formatVector(result.matrixB, precision)}`}
							block
						/>
						<KaTex class="w-fit mx-auto" data={formatResult()} block />
						<KaTex
							class="w-fit mx-auto"
							data={`\\therefore f(${result.xValue}) = ${result.result} \\space {\\color{red}\\#}`}
							block
						/>
					{:else}
						<p class="text-center text-sm text-muted-foreground py-8">Please enter the points</p>
					{/if}
				{/key} -->
			</Card.Content>
		</Card.Root>
	</Tabs.Content>
</Tabs.Root>
