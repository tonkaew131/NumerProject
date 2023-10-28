<script lang="ts">
	import Icon from '@iconify/svelte';
	import InterpolationInput from '$lib/components/interpolationInput.svelte';
	import KaTex from '$lib/components/KaTex.svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Tabs from '$lib/components/ui/tabs';
	import type { SplineInterpolationResult } from '$lib/solutions/spline';

	let inputData: {
		pointSize: string | number;
		xValue: string | number;
		points: {
			[key: number]: {
				x: number;
				y: number;
			};
		};
		mode: 'linear' | 'quadratic' | 'cubic' | string;
	} = {
		pointSize: 3,
		xValue: '',
		points: {},
		mode: 'linear'
	};

	let modalMessage = {
		title: '',
		description: ''
	};
	let loading = false;

	let result: SplineInterpolationResult & {
		input: typeof inputData;
	} = {
		result: 9.681150227462552,
		resultAt: 1,
		funcs: {
			'1': {
				a: 9.374999999949788e-18,
				b: 0,
				c: -0.0000030675000000001803,
				d: 9.81
			},
			'2': {
				a: -9.375000000110716e-18,
				b: 2.2500000000124775e-12,
				c: -0.00000315750000000033,
				d: 9.811200000000001
			}
		},
		input: {
			pointSize: 3,
			xValue: '42235',
			points: {
				'0': {
					x: 0,
					y: 9.81
				},
				'1': {
					x: 40000,
					y: 9.6879
				},
				'2': {
					x: 80000,
					y: 9.5682
				}
			},
			mode: 'cubic'
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

		const pointsArray = [];
		for (const idx in inputData.points) {
			pointsArray.push(inputData.points[idx]);
		}

		const res = await fetch('/api/solution/inter/spline', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				points: pointsArray,
				x: Number(inputData.xValue),
				mode: inputData.mode
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
			return;
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

		console.log(result);
		// formatResultData();
	}

	const formatValue = (num: number | undefined, precision: number) => {
		if (num == undefined) return '0';

		if (num.toString().includes('e')) {
			const [mantissa, exponent] = num.toString().split('e');
			const formatMantissa = parseFloat(parseFloat(mantissa).toFixed(precision));
			return `${formatMantissa} \\times 10^{${exponent}}`;
		} else {
			return parseFloat(num.toFixed(precision));
		}
	};
</script>

<svelte:head>
	<title>Spline interpolation</title>
</svelte:head>

<h3 class="text-center">🥹 Spline interpolation</h3>

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

<Tabs.Root value="linear" class="mx-auto w-fit">
	<Tabs.List class="" style="--background: 142, 71%, 45%; --foreground: 0, 0%, 100%;">
		<Tabs.Trigger
			value="linear"
			on:click={() => {
				inputData.mode = 'linear';
			}}>Linear</Tabs.Trigger
		>
		<Tabs.Trigger
			value="quadratic"
			on:click={() => {
				inputData.mode = 'quadratic';
			}}>Quadratic</Tabs.Trigger
		>
		<Tabs.Trigger
			value="cubic"
			on:click={() => {
				inputData.mode = 'cubic';
			}}>Cubic</Tabs.Trigger
		>
	</Tabs.List>
</Tabs.Root>

<InterpolationInput
	bind:points={inputData.points}
	bind:xValue={inputData.xValue}
	bind:pointSize={inputData.pointSize}
	selectedButton={false}
	onClickCalculate={() => computeResult()}
/>

<Card.Root class="mt-12">
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
					{#if result.input.mode == 'linear'}
						<KaTex
							class="w-fit mx-auto"
							data={`
						\\begin{aligned}
						${Object.keys(result.funcs)
							.map((f) => {
								return `f_${f}(x) & = ${result.funcs[Number(f)].fx1} + 
									(${result.funcs[Number(f)].slope})
									(x - ${result.funcs[Number(f)].offset});
									& & ${result.input.points[Number(f) - 1].x} \\le x \\le ${result.input.points[Number(f)].x}
									\\\\`;
							})
							.join('')}
						\\end{aligned} \\\\~\\\\
						f(${result.input.xValue}) = ${result.funcs[result.resultAt].fx1} + 
						(${result.funcs[result.resultAt].slope})
						(${result.input.xValue} - ${result.funcs[result.resultAt].offset})\\\\
						f(${result.input.xValue}) = ${result.result}
						`}
							block
						/>
					{/if}
					{#if result.input.mode == 'quadratic'}
						<KaTex
							class="w-fit mx-auto"
							data={`
					\\begin{aligned}
					${Object.keys(result.funcs)
						.map((f) => {
							return `f_${f}(x) & = 
								(${formatValue(result.funcs[Number(f)].a, precision)})x^2 + 
								(${formatValue(result.funcs[Number(f)].b, precision)})x + 
								(${formatValue(result.funcs[Number(f)].c, precision)});
								& & ${result.input.points[Number(f) - 1].x} \\le x \\le ${result.input.points[Number(f)].x}
								\\\\`;
						})
						.join('')}
					\\end{aligned} \\\\~\\\\
					f(${result.input.xValue}) = 
					${formatValue(result.funcs[result.resultAt].a, precision)}x^2 + 
					${formatValue(result.funcs[result.resultAt].b, precision)}x + 
					${formatValue(result.funcs[result.resultAt].c, precision)}
					\\\\
					f(${result.input.xValue}) = ${result.result}
					`}
							block
						/>
					{/if}
				{:else}
					<p class="text-center text-sm text-muted-foreground">Please enter the points</p>
				{/if}
			{/key}
		{/if}
	</Card.Content>
</Card.Root>
