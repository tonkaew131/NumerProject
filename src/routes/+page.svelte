<script lang="ts">
	import Label from '$lib/components/ui/label/label.svelte';

	import * as Select from '$lib/components/ui/select';
	import Conjugate from './linear/conjugate.svelte';

	let mode: string = '';
	let solutionMode: string = '';
</script>

<div class="prose max-w-6xl mx-auto pt-24 pb-48 w-11/12">
	<h1 class="text-center w-fit mx-auto">
		Project of Numerical methods
		<div class="h-[2px] w-full bg-primary my-2 rounded-full" />
	</h1>

	<div class="flex gap-4 items-center flex-wrap justify-center">
		<Label class="flex items-center gap-2">
			Type of Problem:
			<Select.Root
				onSelectedChange={(e) => {
					const value = e?.value;
					if (value == undefined) mode = '';
					else mode = String(value);

					solutionMode = '';
				}}
			>
				<Select.Trigger class="w-64">
					<Select.Value placeholder="-" />
				</Select.Trigger>
				<Select.Content>
					<Select.Item value="root">Root of Equation</Select.Item>
					<Select.Item value="linear">Linear algebra equation</Select.Item>
				</Select.Content>
			</Select.Root>
		</Label>

		<Label class="flex items-center gap-2">
			Solution:
			<Select.Root
				onSelectedChange={(e) => {
					const value = e?.value;
					if (value == undefined) solutionMode = '';
					else solutionMode = String(value);
				}}
			>
				<Select.Trigger class="w-64">
					<Select.Value placeholder="-" />
				</Select.Trigger>
				<Select.Content>
					{#if mode === 'root'}
						<!-- <Select.Item value="root">Root of Equation</Select.Item> -->
					{:else if mode === 'linear'}
						<Select.Item value="linear-conjugate">Conjudate Gradient Methods</Select.Item>
					{/if}
				</Select.Content>
			</Select.Root>
		</Label>
	</div>

	{#if solutionMode === 'linear-conjugate'}
		<Conjugate />
	{/if}
</div>