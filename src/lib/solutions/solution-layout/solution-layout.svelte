<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { cn } from '$lib/utils';

	import Input from './solution-layout-input.svelte';
	import Result from './solution-layout-result.svelte';

	interface $$Props {
		class?: string;
		problemType: string;
		solutionType: string;
		modalMessage?: {
			title: string;
			description: string;
		};
	}

	let className: $$Props['class'] = undefined;
	export let problemType: $$Props['problemType'] = '';
	export let solutionType: $$Props['solutionType'] = '';
	export let modalMessage: $$Props['modalMessage'] = {
		title: '',
		description: ''
	};

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

{#if modalMessage}
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
{/if}

<slot class={cn('', className)} {C} />
