<script lang="ts">
	import Icon from '@iconify/svelte';

	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Toggle from '$lib/components/ui/toggle/toggle.svelte';

	export let onClickCalculate: (e: MouseEvent) => void;

	export let selectedButton = true;

	export let pointSize = 3;

	export let xValue: number;
	export let points: {
		[key: number]: {
			x: number;
			y: number;
		};
	} = {};
	export let selectedPoint: number[] = [];

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

	let toggleState = false;
	function onToggleAll(e: CustomEvent) {
		toggleState = e.detail.currentTarget.getAttribute('data-state') == 'off';

		// if (toggleState) {
		// 	selectedPoint = Array.from(Array(pointSize).keys());
		// } else {
		// 	selectedPoint = [];
		// }

		// selectedPoint = [...selectedPoint];

		// const inputPoints = document.getElementsByClassName('selected-points');
		// for (let i = 0; i < inputPoints.length; i++) {
		// 	inputPoints[i].setAttribute('data-state', toggleState ? 'checked' : 'unchecked');
		// 	inputPoints[i].setAttribute('aria-checked', toggleState ? 'true' : 'false');
		// }
	}
</script>

<div class="flex items-end gap-2 mt-2 justify-center">
	<div>
		Number of points 🫵
		<div class="flex gap-1">
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
	<Button class="h-11" on:click={onClickCalculate}>Calculate!</Button>
</div>

<Card.Root class="w-fit mt-2 mx-auto overflow-x-auto max-w-full">
	<Card.Content class="w-fit py-5">
		<div class="flex">
			{#if selectedButton}
				<div class="flex flex-col gap-1 justify-around">
					{#each Array(pointSize) as _, idx}
						<Checkbox
							onCheckedChange={(val) => {
								if (typeof val === 'boolean') onSelectPoint(idx, val);
							}}
							class="selected-points"
						/>
					{/each}
				</div>
			{/if}
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
		{#if selectedButton}
			<Toggle variant="outline" class="mt-2" on:click={onToggleAll}
				>{!toggleState ? 'Tick all' : 'Untick all'}</Toggle
			>
		{/if}
	</Card.Content>
</Card.Root>
