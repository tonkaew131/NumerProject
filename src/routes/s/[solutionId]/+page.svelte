<script lang="ts">
	import { onMount } from 'svelte';
	import Icon from '@iconify/svelte';

	import Guass from '../../linear/guass/guass.svelte';

	import type { PageData } from './$types';
	export let data: PageData;
	let result: { status: string; data: any };

	let loading = true;

	onMount(() => {
		const fetchSolution = async () => {
			const res = await fetch(`/api/solution?solutionId=${data.solutionId}`);
			const jsonData = await res.json();
			result = jsonData;
			loading = false;
		};

		fetchSolution();
	});
</script>

<svelte:head>
	<title>{data.solutionId} | TKW</title>
</svelte:head>

<div class="prose max-w-6xl mx-auto pt-16 pb-48 w-11/12">
	{#if loading}
		<div class="w-full flex justify-center py-16">
			<Icon icon="eos-icons:loading" class="text-center text-6xl text-primary" />
		</div>
	{:else if result?.data != undefined}
		{#if result.data.solution_type === 'GUASS'}
			<Guass result={JSON.parse(result.data.output)} input={false} />
		{/if}
	{/if}
</div>
