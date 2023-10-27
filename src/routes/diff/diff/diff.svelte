<script lang="ts">
	import Icon from '@iconify/svelte';
	import KaTex from '$lib/components/KaTex.svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog';
	import { diffFormula, type DifferentiationResult } from '$lib/solutions/differentiation';

	import Input from './input.svelte';
	import { to, typeOf } from 'mathjs';

	let inputData = {
		order: '',
		error: '',
		direction: '',
		func: '',
		h: '',
		x: ''
	};

	export const precision = 6;
	let modalMessage = {
		title: '',
		description: ''
	};
	let loading = false;

	let result: DifferentiationResult & { input: typeof inputData };

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

		const res = await fetch('/api/solution/diff/diff', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				func: inputData.func,
				x: inputData.x,
				h: inputData.h,
				order: inputData.order,
				error: inputData.error,
				direction: inputData.direction
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
	}

	const orderText: { [key: string]: string } = {
		'1': 'First',
		'2': 'Second',
		'3': 'Third',
		'4': 'Fourth'
	};
</script>

<svelte:head>
	<title>Numerical Differentiation</title>
	<meta name="description" content="Numerical Differentiation" />
</svelte:head>

<h3 class="text-center">🥹 Numerical Differentiation</h3>

<Input
	onClickCalculate={() => computeResult()}
	bind:order={inputData.order}
	bind:error={inputData.error}
	bind:direction={inputData.direction}
	bind:formula={inputData.func}
	bind:hValue={inputData.h}
	bind:xValue={inputData.x}
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
		<KaTex data={'\\text{Solution}'} class="pl-6 pb-0" block />
		{#if loading}
			<div class="w-full flex justify-center py-16">
				<Icon icon="eos-icons:loading" class="text-center text-6xl text-primary" />
			</div>
		{:else}
			{#key result}
				{#if result}
					{@const func =
						diffFormula[result.input.direction][Number(result.input.order)][result.input.error]}
					{@const funcDiff = `f${"'".repeat(Number(result.input.order))}(x)`}
					<KaTex
						class="w-fit mx-auto"
						data={`
						\\text{${orderText[result.input.order]} 
						${result.input.direction} divided-different 
						(error} \\space O(${result.input.error}))
						`}
						block
					/>
					<KaTex
						class="w-fit mx-auto"
						data={`
						f${"'".repeat(Number(result.input.order))}(x_i) =
						\\dfrac
						{${Object.keys(func)
							.filter((k) => k !== 'frac')
							.sort((a, b) => Number(b) - Number(a))
							.map((k, idx) => {
								let xStr = `x_{`;
								if (Number(k) == 0) {
									xStr += 'i';
								} else if (Number(k) > 0) {
									xStr += `i+${Number(k)}`;
								} else {
									xStr += `i${Number(k)}`;
								}
								xStr += '}';

								let frac = '';
								if (func[Number(k)] > 0 && idx > 0) frac += '+';
								if (func[Number(k)] != 1 && func[Number(k)] != -1) frac += func[Number(k)];
								if (func[Number(k)] == -1) frac += '-';
								return `${frac}f(${xStr})`;
							})
							.join('')}}
						{${func.frac}} \\\\~\\\\
						f${"'".repeat(Number(result.input.order))}(${result.input.x}) =
						\\dfrac
						{${Object.keys(result.fx)
							.sort((a, b) => Number(b) - Number(a))
							.map((k, idx) => {
								const val = result.fx[Number(k)];

								let frac = '';
								if (val > 0 && idx > 0) frac += '+';

								return `${frac}${parseFloat(val.toFixed(precision))}`;
							})
							.join('')}}
						{${parseFloat(Number(result.h).toFixed(precision * 2))}} \\\\
						{\\color{white}f${"'".repeat(Number(result.input.order))}(${result.input.x})} =
						${result.result}
						`}
						block
					/>
					<KaTex
						class="w-fit mx-auto"
						data={`
						\\text{Exact Differentiation; } f(x) = ${result.input.func} \\\\
						\\text{\\color{white}Exact Differentiation; } 
						${funcDiff} = ${result.exactFunc} \\\\
						\\text{At } x = ${result.input.x}; \\space
						f${"'".repeat(Number(result.input.order))}(${result.input.x}) = ${result.exactResult} \\\\
						`}
						block
					/>
					<KaTex
						class="w-fit mx-auto"
						data={`
						\\text{error = } \\left|
						\\dfrac{${funcDiff}_{numerical} - ${funcDiff}_{true}}{${funcDiff}_{true}}
						\\right| \\times 100 \\% =
						${(result.errorValue * 100).toFixed(precision)} \\%
						`}
						block
					/>
				{:else}
					<p class="text-center text-sm text-muted-foreground py-8">
						Please enter the function, and its parameters
					</p>
				{/if}
			{/key}
		{/if}
	</Card.Content>
</Card.Root>
