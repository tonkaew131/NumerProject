<script lang="ts">
	import KaTex from '$lib/components/KaTex.svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog';
	import { differentiation } from '$lib/solutions/differentiation';

	import Input from './input.svelte';

	let inputData = {
		order: '',
		error: '',
		direction: '',
		func: ''
	};

	let modalMessage = {
		title: '',
		description: ''
	};
	let loading = false;
</script>

<svelte:head>
	<title>Numerical Differentiation</title>
	<meta name="description" content="Numerical Differentiation" />
</svelte:head>

<h3 class="text-center">🥹 Numerical Differentiation</h3>

<Input
	onClickCalculate={() => console.log('clicked')}
	bind:order={inputData.order}
	bind:error={inputData.error}
	bind:direction={inputData.direction}
	bind:formula={inputData.func}
/>

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

<Card.Root class="">
	<Card.Content class="py-5">
		<KaTex data={'\\text{Solution}'} class="pl-6" block />
	</Card.Content>
</Card.Root>
