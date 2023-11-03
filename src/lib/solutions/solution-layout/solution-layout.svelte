<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { cn } from '$lib/utils';
	import Icon from '@iconify/svelte';

	import Input from './solution-layout-input.svelte';
	import modal from './solution-layout-modal-store';
	import Result from './solution-layout-result.svelte';
	import { ProblemData, SolutionData, type SolutionType } from './solution-type';

	interface $$Props {
		class?: string;
		solutionType: SolutionType;
	}

	let className: $$Props['class'] = undefined;
	export let solutionType: $$Props['solutionType'];

	const solutionData = SolutionData[solutionType];
	const problemData = ProblemData[solutionData.problemType];

	const C = {
		Input,
		Result
	};

	export { className as class };
</script>

<svelte:head>
	<title>{solutionData.name}</title>
	<meta name="description" content="{problemData.name} - {solutionData.name}" />
</svelte:head>

<!-- Breadcrumbs -->
<div class="flex gap-4 items-center">
	<a href={problemData.url} class="text-primary font-noto text-sm">
		{problemData.name}
	</a>
	<Icon icon="mingcute:right-fill" />
	<span class="text-primary font-noto text-sm">
		{solutionData.name}
	</span>
</div>

<h3 class="text-center mt-0">🥹 {solutionData.name}</h3>

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
