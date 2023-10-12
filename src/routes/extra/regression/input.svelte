<script lang="ts">
	import Icon from '@iconify/svelte';

	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';

	export let onClickCalculate: (e: MouseEvent) => void;
	export let xValue: number;
	export let mOrder = 1;
	export let pointSize = 3;

	export let points: {
		[key: number]: {
			x: number;
			y: number;
		};
	} = {};

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
		m order
		<Input
			placeholder="1"
			min="1"
			max="5"
			type="number"
			class="bg-white mt-2 h-11 w-32"
			bind:value={mOrder}
		/>
	</Label>
</div>

<div class="flex items-end gap-2 mt-2 justify-center">
	<Label>
		X value
		<Input placeholder="0.00" type="number" class="bg-white mt-2 h-11 w-52" bind:value={xValue} />
	</Label>
	<Button class="h-11" on:click={onClickCalculate}>Calculate!</Button>
</div>

<Card.Root class="w-fit mt-2 mx-auto overflow-x-auto max-w-full">
	<Card.Content class="w-fit py-5">
		<div class="flex">
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
	</Card.Content>
</Card.Root>
