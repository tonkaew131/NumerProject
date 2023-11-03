<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { cn } from '$lib/utils';

	import Input from './solution-layout-input.svelte';
	import modal from './solution-layout-modal-store';
	import Result from './solution-layout-result.svelte';

	interface $$Props {
		class?: string;
		problemType: string;
		solutionType: string;
	}

	let className: $$Props['class'] = undefined;
	export let problemType: $$Props['problemType'] = '';
	export let solutionType: $$Props['solutionType'] = '';

	const C = {
		Input,
		Result
	};

	export { className as class };
</script>

<svelte:head>
	<title>{solutionType}</title>
	<meta name="description" content="{problemType} - {solutionType}" />
</svelte:head>

<h3 class="text-center">🥹 {solutionType}</h3>

<Dialog.Root>
	<Dialog.Trigger id="trigger-modal" />
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title id="modal-title">{$modal.title}</Dialog.Title>
			<Dialog.Description id="modal-description">
				{$modal.description}
			</Dialog.Description>
		</Dialog.Header>
	</Dialog.Content>
</Dialog.Root>

<slot class={cn('', className)} {C} />
