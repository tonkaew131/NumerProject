<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import * as Card from '$lib/components/ui/card';

	import Icon from '@iconify/svelte';

	export let onClickCalculate: (e: MouseEvent) => void;
	export let xValue: { [key: number]: number } = {};
	export let kValue: number = 1;
	export let pointSize = 3;

	const K_MAX = 8;

	export let pointsArray: {
		[key: number]: {
			[key: number]: number;
		};
	} = {};
	export let yArray: {
		[key: number]: number;
	} = {};

	function onInputX(e: InputEvent, k: number, idx: number) {
		const target = e.target as HTMLInputElement;
		const value = Number(target.value);

		pointsArray[k] = {
			...pointsArray[k],
			[idx]: value
		};
	}

	function onInputXValue(e: InputEvent, k: number) {
		const target = e.target as HTMLInputElement;
		const value = Number(target.value);

		xValue[k] = value;
	}

	function onInputY(e: InputEvent, idx: number) {
		const target = e.target as HTMLInputElement;
		const value = Number(target.value);

		yArray[idx] = value;
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
		K (Number of X)
		<Input
			placeholder="1"
			min="1"
			max={String(K_MAX)}
			type="number"
			class="bg-white mt-2 h-11 w-32"
			bind:value={kValue}
		/>
	</Label>
</div>

<div class="flex items-end gap-2 mt-2 justify-center">
	<Label>
		X value
		<div class="flex gap-1">
			{#each Array(Number(Math.min(kValue, K_MAX))) as _, k}
				<Input
					placeholder={`x${k}`}
					type="number"
					class="bg-white mt-2 h-11 w-20"
					on:input={(e) => onInputXValue(e, k)}
				/>
			{/each}
		</div>
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
						{#each Array(Number(Math.min(kValue, K_MAX))) as _, k}
							<Input
								type="number"
								class="w-20 bg-white"
								placeholder={`x${k},${idx}`}
								on:input={(e) => onInputX(e, k, idx)}
							/>
						{/each}
						<Input
							type="number"
							class="w-28 bg-white"
							placeholder={`y${idx}`}
							on:input={(e) => onInputY(e, idx)}
						/>
					</div>
				{/each}
			</div>
		</div>
	</Card.Content>
</Card.Root>
