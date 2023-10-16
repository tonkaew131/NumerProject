<script lang="ts">
	import Icon from '@iconify/svelte';
	import { evaluate } from 'mathjs';
	import type { Shape } from 'plotly.js';

	import Graph from '$lib/components/graph.svelte';
	import KaTex from '$lib/components/KaTex.svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog';
	import type { TrapezoidalResult } from '$lib/solutions/trapezoidalRule';

	import Input from './input.svelte';
	let inputData = {
		xStart: '',
		xEnd: '',
		n: '',
		formula: '',
		errorFactor: 0.000001
	};

	let modalMessage = {
		title: '',
		description: ''
	};
	let loading = false;

	let result: TrapezoidalResult & {
		input: typeof inputData;
		graphLine: {
			x: number[];
			y: number[];
		};
	} = {
		result: 170031.9375,
		fx: {
			'1': {
				x: 3.5,
				y: 1674.5625
			},
			'2': {
				x: 5,
				y: 10722
			},
			'3': {
				x: 6.5,
				y: 41294.0625
			},
			start: 78,
			end: 119250
		},
		input: {
			xStart: '2',
			xEnd: '8',
			n: '4',
			formula: '4x^5-3x^4+x^3-6x+2',
			errorFactor: 0.000001
		},
		graphLine: {
			x: [
				1.4, 1.472, 1.5439999999999998, 1.6159999999999999, 1.688, 1.7599999999999998,
				1.8319999999999999, 1.904, 1.976, 2.048, 2.12, 2.1919999999999997, 2.264, 2.336, 2.408,
				2.4799999999999995, 2.5519999999999996, 2.6239999999999997, 2.6959999999999997, 2.768, 2.84,
				2.912, 2.984, 3.056, 3.1279999999999997, 3.1999999999999997, 3.272, 3.344, 3.416,
				3.4879999999999995, 3.5599999999999996, 3.6319999999999997, 3.7039999999999997, 3.776,
				3.848, 3.9199999999999995, 3.9919999999999995, 4.064, 4.135999999999999, 4.208,
				4.279999999999999, 4.351999999999999, 4.4239999999999995, 4.4959999999999996, 4.568, 4.64,
				4.712, 4.783999999999999, 4.856, 4.927999999999999, 5, 5.071999999999999, 5.144,
				5.215999999999999, 5.288, 5.359999999999999, 5.432, 5.504, 5.575999999999999, 5.648,
				5.719999999999999, 5.792, 5.863999999999999, 5.936, 6.007999999999999, 6.08,
				6.151999999999999, 6.224, 6.295999999999999, 6.3679999999999986, 6.4399999999999995,
				6.511999999999999, 6.584, 6.655999999999999, 6.728, 6.799999999999999, 6.872,
				6.943999999999999, 7.016, 7.087999999999999, 7.16, 7.231999999999999, 7.3039999999999985,
				7.3759999999999994, 7.447999999999999, 7.52, 7.591999999999999, 7.664, 7.735999999999999,
				7.808, 7.879999999999999, 7.952, 8.024, 8.096, 8.168, 8.239999999999998, 8.312,
				8.383999999999999, 8.456, 8.527999999999999
			],
			y: [
				6.332159999999998, 9.916530030870526, 14.466484290256883, 20.147562147938295,
				27.143284808220663, 35.65608407039997, 45.9082310892257, 58.142765135364066,
				72.6244223558615, 89.64056453460788, 109.50210785280004, 132.54445164940483,
				159.12840718162317, 189.64112638535266, 224.49703063565102, 264.1387395071997,
				309.0379995347679, 359.6966129736743, 416.64736656025167, 480.4549602723101,
				551.7169360895999, 631.0646067542754, 719.1639845313575, 816.7167099691992,
				924.460980659945, 1043.1724799999995, 1173.665305950486, 1316.7928997977126,
				1473.448974913634, 1644.5684455163155, 1831.128355430399, 2034.1488068475605,
				2254.693889086979, 2493.8726073557973, 2752.8398115095833, 3032.797124812798,
				3334.9938726992586, 3660.7280115326, 4011.347057366725, 4388.249014706308,
				4792.883305267196, 5226.751696736941, 5691.409231535206, 6188.465155574266,
				6719.583847019443, 7286.4857450495965, 7890.9482786175695, 8534.806795210645,
				9219.955489611053, 9948.348332656353, 10722, 11542.986800871693, 12413.44760683797,
				13335.584780562522, 14311.665104566817, 15344.020709990391, 16435.050005351502,
				17587.21860530739, 18803.060259414913, 20085.177780890957, 21436.24397537278,
				22859.002569678712, 24356.269140568347, 25930.9320435033, 27585.953341407345,
				29324.3697334272, 31149.2934836927, 33063.91335007755, 35071.49551295947, 37175.38450398094,
				39379.004134809584, 41685.85842589843, 44099.53253524674, 46623.69368716007,
				49262.09210101117, 52018.56191999996, 54897.02213991451, 57901.47753789098,
				61036.01960117462, 64304.82745587967, 67712.1687957504, 71262.400810921, 74959.97111667653,
				78809.41868221325, 82815.37475939866, 86982.56381153277, 91315.8044421077,
				95820.01032356893, 100500.191126075, 105361.45344625882, 110409.00173598714,
				115648.1392311221, 121084.26888028062, 126722.89427359591, 132569.62057147687,
				138630.15543336948, 144910.30994651688, 151415.9995547195, 158153.24498709632,
				165128.17318684427
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

		const res = await fetch('/api/solution/integrate/trapezoidal', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				xStart: inputData.xStart,
				xEnd: inputData.xEnd,
				func: inputData.formula,
				n: inputData.n
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
		result.input = inputData;
		formatResultData();
	}

	function formatResultData() {
		const range = Number(inputData.xEnd) - Number(inputData.xStart);
		const minX = Number(inputData.xStart) - range * 0.1;
		const maxX = Number(inputData.xEnd) + range * 0.1;
		result.graphLine = {
			x: [],
			y: []
		};
		for (let i = 0; i < 100; i++) {
			const x = minX + (maxX - minX) * (i / 100);
			result.graphLine.x.push(x);
			result.graphLine.y.push(evaluate(inputData.formula, { x }));
		}

		console.log(result);
	}

	function trapezoidLine(): Partial<Shape>[] {
		return (result?.trapezoidLine?.other || []).map((le) => {
			return {
				type: 'line',
				xref: 'x',
				yref: 'y',
				x0: le.x0,
				y0: le.y0,
				x1: le.x1,
				y1: le.y1,
				line: {
					color: 'black',
					width: 2,
					dash: 'solid'
				}
			};
		});
	}
</script>

<svelte:head>
	<title>Single Trapezoidal Rule</title>
	<meta name="description" content="Single Trapezoidal Rule - Numerical Integration" />
</svelte:head>

<h3 class="text-center">🥹 Composite Trapezoidal Rule</h3>

<Input
	bind:xStart={inputData.xStart}
	bind:xEnd={inputData.xEnd}
	bind:formula={inputData.formula}
	bind:n={inputData.n}
	onClickCalculate={() => computeResult()}
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
					}
				]}
			/>
		{/key}
	</Card.Content>
</Card.Root>

<Card.Root class="w-full mt-12">
	<Card.Content class="py-5">
		<KaTex data={'\\text{Solution}'} class="pl-6" block />
		{#if loading}
			<div class="w-full flex justify-center py-16">
				<Icon icon="eos-icons:loading" class="text-center text-6xl text-primary" />
			</div>
		{:else}
			{#key result}
				{#if result}
					{@const precision = 6}
					<KaTex
						class="w-fit mx-auto"
						block
						data={`
					\\displaystyle
					\\text{Evaluate} \\quad\\quad
					I = \\int^{${result.input.xEnd}}_{${result.input.xStart}} f(x) \\space dx
					\\space = \\int^{${result.input.xEnd}}_{${result.input.xStart}} ${
							result.input.formula
						} \\space dx \\\\
					Here \\quad\\quad\\quad\\space
					x_0 = a = ${result.input.xStart}; \\space
					f(x_0) = ${result.input.formula.replaceAll('x', `(${result.input.xStart})`)}
					= ${result.fx.start} \\\\
					\\quad\\quad\\quad\\quad\\quad\\space\\space
					x_1 = b = ${result.input.xEnd}; \\space
					f(x_1) = ${result.input.formula.replaceAll('x', `(${result.input.xEnd})`)}
					= ${result.fx.end} \\\\
					Thus \\kern{3.6em}
					I = \\dfrac{h}{2}[f(x_0)+f(x_1)] 
					= \\dfrac{${result.input.xEnd}-(${result.input.xStart})}{2}(${result.fx.start}+${result.fx.end})
					= ${result.result}
					`}
					/>
					<!-- <KaTex
					class="w-fit mx-auto"
					block
					data={`
					\\displaystyle
					\\text{Thus the true error is:} \\\\
					\\epsilon_t = | \\dfrac{1}{2} | \\times 100\\% = ${0}
				`}
				/> -->
				{:else}
					<p class="text-center text-sm text-muted-foreground py-8">Please enter the function</p>
				{/if}
			{/key}
		{/if}
	</Card.Content>
</Card.Root>
