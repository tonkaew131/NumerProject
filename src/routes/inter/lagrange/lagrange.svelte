<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Card from '$lib/components/ui/card';

	import type { LangrangeInterpolationResult } from '$lib/solutions/langrangeInterpolation';
	import InterpolationInput from '$lib/components/interpolationInput.svelte';

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
	export let selectedPoint: number[] = [];

	interface resultType {
		xValue: number;
		pointsArray: {
			x: number;
			y: number;
		}[];
	}
	let result: resultType & LangrangeInterpolationResult;

	let modalMessage = {
		title: '',
		description: ''
	};
	let loading = false;

	async function computeResult() {
		const pointsArray = [];
		for (const idx of selectedPoint) {
			pointsArray.push(points[idx]);
		}

		const selectedPointX = [];
		for (const idx of selectedPoint) {
			selectedPointX.push(points[idx].x);
		}

		loading = true;

		const res = await fetch('/api/solution/inter/lagrange', {
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

		console.log(result);

		result = result;
	}

	function formatResult(
		result: resultType & LangrangeInterpolationResult,
		precision: number
	): string[] {
		let formula = '';
		const n = Object.keys(result.l).length;

		let resultFormula = [];
		let resultValue = [];
		for (let i = 0; i < n; i++) {
			resultFormula.push(`L_{ ${i} }f(x_{ ${i} })`);
			resultValue.push(`(${result.l[i].toFixed(precision)})(${result.pointsArray[i].y})`);

			formula += `L_{${i}} = `;
			let upFormula = '';
			let downFormula = '';
			let upValue = '';
			let downValue = '';
			for (let j = 0; j < n; j++) {
				if (i == j) continue;

				upFormula += `(x_{ ${j} } - x)`;
				downFormula += `(x_{ ${j} } - x_{ ${i} })`;

				upValue += `(${result.pointsArray[j].x} - ${result.xValue})`;
				downValue += `(${result.pointsArray[j].x} - ${result.pointsArray[i].x})`;
			}

			formula += `\\frac{${upFormula}}{${downFormula}} = \\frac{${upValue}}{${downValue}} = ${result.l[
				i
			].toFixed(precision)}\\\\~\\\\`;

			if (i != n - 1) formula += `\\\\~\\\\`;
		}

		let arr = [];
		arr.push(formula);

		formula = '';
		formula += `f(${result.xValue}) = ${resultFormula.join(' + ')} \\\\
        {\\color{white} f(${result.xValue})} = ${resultValue.join(
			' + \\\\ {\\color{white} f(42235) = \\space}'
		)} \\\\
        {\\color{white} f(${result.xValue})} = ${result.result}`;
		arr.push(formula);

		return arr;
	}
</script>

<svelte:head>
	<title>Lagrange Interpolation</title>
</svelte:head>

<h3 class="text-center">🥹 Lagrange Interpolation</h3>

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

<InterpolationInput
	bind:points
	bind:xValue
	bind:pointSize
	bind:selectedPoint
	onClickCalculate={(e) => computeResult()}
/>

<Card.Root class="mt-12">
	<Card.Content class="py-5">
		<KaTex data={'\\text{Solution}'} class="pl-6" block />
		{#if loading}
			<div class="w-full flex justify-center py-16">
				<Icon icon="eos-icons:loading" class="text-center text-6xl text-primary" />
			</div>
		{/if}
		{#key result}
			{#if result && !loading}
				{@const precision = 6}
				{#each formatResult(result, precision) as str}
					<KaTex class="w-fit mx-auto" data={str} block />
				{/each}
			{/if}
		{/key}
		{#if !result}
			<p class="text-center text-sm text-muted-foreground">Please enter the points</p>
		{/if}
	</Card.Content>
</Card.Root>
