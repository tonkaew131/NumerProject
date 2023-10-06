<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte';

	onMount(async () => {
		const Plotly = await import('plotly.js-dist-min');
		if (browser) {
			const graph = document.getElementById('graph');
			if (!graph) return;

			Plotly.newPlot(
				graph,
				[
					{
						x: [1, 2, 3, 4, 5],
						y: [1, 2, 4, 8, 16]
					}
				],
				{
					margin: { t: 0, r: 0 },
					dragmode: 'pan'
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
