<script lang="ts">
	import KaTex from '$lib/components/KaTex.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import * as Select from '$lib/components/ui/select';

	export let onClickCalculate: (e: MouseEvent) => void;
	export let order: number | string;
	export let error: string;
	export let direction: string;
	export let formula = '';

	function onChangeOrder(e: any) {
		const value = e?.value;
		if (value == undefined) order = '';
		else order = String(value);
	}
	function onChangeError(e: any) {
		const value = e?.value;
		if (value == undefined) error = '';
		else error = String(value);
	}
	function onChangeDirection(e: any) {
		const value = e?.value;
		if (value == undefined) direction = '';
		else direction = String(value);
	}
</script>

<Card.Root class="">
	<Card.Content class="py-0 px-8">
		{#key formula}
			<KaTex
				block
				data={`f(x) = ${formula || '...'}`}
				class="mx-auto w-fit text-3xl max-w-full overflow-x-auto"
			/>
		{/key}
	</Card.Content>
</Card.Root>

<div class="flex items-end justify-center gap-2 mt-6">
	<Label class="">
		Order
		<Select.Root onSelectedChange={onChangeOrder}>
			<Select.Trigger class="bg-white h-11 w-28 mt-2">
				<Select.Value placeholder="-" />
			</Select.Trigger>
			<Select.Content>
				<Select.Item class="hover:cursor-pointer" value="1">First</Select.Item>
				<Select.Item class="hover:cursor-pointer" value="2">Second</Select.Item>
				<Select.Item class="hover:cursor-pointer" value="3">Third</Select.Item>
				<Select.Item class="hover:cursor-pointer" value="4">Fourth</Select.Item>
			</Select.Content>
		</Select.Root>
	</Label>
	<Label class="">
		Error
		<Select.Root onSelectedChange={onChangeError}>
			<Select.Trigger class="bg-white h-11 w-32 mt-2">
				<Select.Value placeholder="-" />
			</Select.Trigger>
			<Select.Content>
				<Select.Item class="hover:cursor-pointer" value="h">O(h)</Select.Item>
				<Select.Item class="hover:cursor-pointer" value="h^2">O(h^2)</Select.Item>
				<Select.Item class="hover:cursor-pointer" value="h^4">O(h^4)</Select.Item>
			</Select.Content>
		</Select.Root>
	</Label>
	<Label class="">
		Direction
		<Select.Root onSelectedChange={onChangeDirection}>
			<Select.Trigger class="bg-white h-11 w-32 mt-2">
				<Select.Value placeholder="-" />
			</Select.Trigger>
			<Select.Content>
				<Select.Item class="hover:cursor-pointer" value="forward">Forward</Select.Item>
				<Select.Item class="hover:cursor-pointer" value="backward">Backward</Select.Item>
				<Select.Item class="hover:cursor-pointer" value="centered">Centered</Select.Item>
			</Select.Content>
		</Select.Root>
	</Label>
</div>

<div class="flex items-end justify-center gap-2 mt-1">
	<Label class="mt-1">
		<KaTex data={`f(x)`} />
		<Input class="bg-white h-11 w-72 mt-1" type="text" bind:value={formula} placeholder="x^2-7" />
	</Label>
	<Button class="h-11" on:click={onClickCalculate}>Calculate!</Button>
</div>
