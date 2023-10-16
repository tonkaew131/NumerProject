<script lang="ts">
	import type { Data, Layout } from 'plotly.js';
	import { onMount } from 'svelte';

	import { browser } from '$app/environment';
	import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte';

	export let graphData: Data[] = [];
	export let layout: Partial<Layout> | undefined = {};

	onMount(async () => {
		const Plotly = await import('plotly.js-dist-min');
		if (browser) {
			const graph = document.getElementById('graph');
			if (!graph) return;

			Plotly.newPlot(
				graph,
				graphData,
				{
					margin: { t: 0, r: 0 },
					dragmode: 'pan',
					...layout
				},
				{
					scrollZoom: true
				}
			);

			const skeleton = document.getElementById('graph-skeleton');
			if (!skeleton) return;
			skeleton.remove();
		}
	});
</script>

<div id="graph" style="width: 100%; min-height: 512px;">
	<Skeleton class="w-full h-[512px]" id="graph-skeleton" />
</div>
