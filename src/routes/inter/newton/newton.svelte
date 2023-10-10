<script lang="ts">
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Toggle from '$lib/components/ui/toggle/toggle.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Card from '$lib/components/ui/card';

	import type { NewtonDividedDifferenceResult } from '$lib/solutions/newtonDivided';

	import KaTex from '$lib/components/KaTex.svelte';

	import Icon from '@iconify/svelte';

	let pointSize = 3;

	let xValue: number;
	let points: {
		[key: number]: {
			x: number;
			y: number;
		};
	} = {};
	let selectedPoint: number[] = [];

	function onInputX(e: InputEvent, idx: number) {
		const target = e.target as HTMLInputElement;
		const value = Number(target.value);

		points[idx] = {
			...points[idx],
			x: value
		};
	}

	function onInputY(e: InputEvent, idx: number) {
		const target = e.target as HTMLInputElement;
		const value = Number(target.value);

		points[idx] = {
			...points[idx],
			y: value
		};
	}

	function onSelectPoint(idx: number, val: boolean) {
		if (val) {
			selectedPoint.push(idx);
		} else {
			selectedPoint = selectedPoint.filter((i) => i !== idx);
		}

		selectedPoint = [...selectedPoint];
	}

	let modalMessage = {
		title: '',
		description: ''
	};

	let loading = false;
	let result: {
		xValue: number;
		pointsArray: {
			x: number;
			y: number;
		}[];
	} & NewtonDividedDifferenceResult;

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
		const pointsArray = [];
		for (const idx of selectedPoint) {
			pointsArray.push(points[idx]);
		}

		const selectedPointX = [];
		for (const idx of selectedPoint) {
			selectedPointX.push(points[idx].x);
		}

		loading = true;

		console.log(pointsArray, selectedPointX, xValue);

		const res = await fetch('/api/solution/inter/newton', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ points: pointsArray, selected_point: selectedPointX, x: xValue })
		});
		const jsonData = await res.json();

		loading = false;
		if (jsonData.error) {
			modalMessage = {
				title: 'Calculation Error!',
				description: jsonData.error.message
			};

			document?.getElementById('trigger-modal')!.click();
			return;
		}

		result = jsonData.data;
		result.xValue = xValue;
		result.pointsArray = pointsArray;

		result = result;
	}

	function formatResult(
		result: {
			xValue: number;
			pointsArray: {
				x: number;
				y: number;
			}[];
		} & NewtonDividedDifferenceResult,
		precision: number
	) {
		result.xValue = Number(result.xValue);

		console.log(result);

		const formatNumber = (num: number) => {
			let number = num.toString();
			if (number.indexOf('e') != -1) {
				const [mantissa, exponent] = number.split('e');
				number = `${Number(mantissa) < 0 ? '(' : ''} ${Number(mantissa).toFixed(
					precision
				)} * 10^{${exponent}} ${Number(mantissa) < 0 ? ')' : ''}`;
			} else {
				number = `${Number(num) < 0 ? '(' : ''} ${num.toFixed(precision)} ${
					Number(num) < 0 ? ')' : ''
				}`;
			}

			return number;
		};

		let formula = [];
		for (let i = 1; i < result.pointsArray.length; i++) {
			let temp = [];
			for (let j = 0; j < i; j++) {
				temp.push(`( ${result.xValue} - ${result.pointsArray[j].x} )`);
			}
			formula.push(`(${formatNumber(result.c[i])} * ${temp.join(' * ')})`);
		}

		return `f(${formatNumber(result.xValue)}) = ${result.c[0].toFixed(
			precision
		)} \\\\ + ${formula.join('\\\\ + ')}`;
	}
</script>

<svelte:head>
	<title>Newton's Divided Difference</title>
</svelte:head>

<h3 class="text-center">🥹 Newton's Divided Difference</h3>

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

<div class="flex items-end gap-2 mt-2 justify-center">
	<div>
		Number of points 🫵
		<div class="flex gap-1 mt-2">
			<Button
				class="bg-red-500 hover:bg-red-500/90 h-11 w-11"
				on:click={() => (pointSize <= 1 ? null : pointSize--)}
			>
				<Icon icon="ic:baseline-minus" />
			</Button>
			<Input
				type="number"
				class="h-11 w-20 bg-white"
				placeholder="3"
				min="1"
				bind:value={pointSize}
			/>
			<Button class="bg-green-500 hover:bg-green-500/90 h-11 w-11" on:click={() => pointSize++}>
				<Icon icon="ic:baseline-plus" />
			</Button>
		</div>
	</div>
	<Label>
		X value
		<Input placeholder="0.00" type="number" class="bg-white mt-2 h-11" bind:value={xValue} />
	</Label>
	<Button class="h-11" on:click={() => computeResult()}>Calculate!</Button>
</div>

<Card.Root class="w-fit mt-2 mx-auto overflow-x-auto max-w-full">
	<Card.Content class="w-fit py-5">
		<div class="flex">
			<div class="flex flex-col gap-1 justify-around">
				{#each Array(pointSize) as _, idx}
					<Checkbox
						onCheckedChange={(val) => {
							if (typeof val === 'boolean') onSelectPoint(idx, val);
						}}
					/>
				{/each}
			</div>
			<div class="flex flex-col gap-1 w-fit">
				{#each Array(pointSize) as _, idx}
					<div class="flex items-center gap-1 w-fit">
						<span class="w-8 text-center">
							{idx + 1}.
						</span>
						<Input
							type="number"
							class="w-48 bg-white"
							placeholder={`x${idx}`}
							on:input={(e) => onInputX(e, idx)}
						/>
						<Input
							type="number"
							class="w-48 bg-white"
							placeholder={`f(x${idx})`}
							on:input={(e) => onInputY(e, idx)}
						/>
					</div>
				{/each}
			</div>
		</div>
		<Toggle variant="outline" class="mt-2">Toggle all</Toggle>
	</Card.Content>
</Card.Root>

<Card.Root class="mt-12">
	<Card.Content class="py-5">
		<KaTex data={'\\text{Solution}'} class="pl-6" block />
		{#if loading}
			<div class="w-full flex justify-center py-16">
				<Icon icon="eos-icons:loading" class="text-center text-6xl text-primary" />
			</div>
		{/if}
		{#key result}
			{#if result}
				{@const precision = 6}
				<KaTex class="w-fit mx-auto" data={formatResult(result, precision)} block />
				<KaTex class="w-fit mx-auto" data={`f(${result.xValue}) = ${result.result}`} block />
			{/if}
		{/key}
	</Card.Content>
</Card.Root>
