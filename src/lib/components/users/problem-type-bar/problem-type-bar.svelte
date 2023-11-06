<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { ProblemData } from '$lib/solutions/solution-layout/solution-type';

	export let problemCount: {
		[key: string]: number;
	};

	const colors: {
		[key: string]: string;
	} = {
		ROOT_OF_EQUATION: 'bg-red-500',
		LINEAR_ALGEBRA_EQUATION: 'bg-yellow-500',
		INTERPOLATION: 'bg-cyan-500',
		EXTRAPOLATION: 'bg-lime-500',
		INTEGRATION: 'bg-purple-500',
		DIFFERENTIATION: 'bg-pink-500'
	};

	const getColor = (problemType: string) => {
		if (problemType in colors) {
			return colors[problemType];
		}
		return 'bg-white';
	};

	const totalSize = Object.values(problemCount).reduce((acc, cur) => {
		return acc + cur;
	}, 0);
</script>

<div
	class="w-[12em] relative dark bg-background/10 h-2 rounded-full flex [&>*:first-child]:rounded-l-full [&>*:last-child]:rounded-r-full"
>
	{#if totalSize === 0}
		<div class="h-full w-full" />
	{/if}
	{#each Object.keys(problemCount) as sl}
		<div
			class="h-full {getColor(sl)} relative group transition-all duration-300"
			style="width: {((problemCount[sl] / totalSize) * 100).toFixed(2)}%"
		>
			{#if sl in ProblemData}
				<Card.Root
					class="absolute z-30 left-1/2 -translate-x-1/2 -top-12 group-hover:opacity-100 opacity-0"
				>
					<Card.Content class="pb-0 py-2 whitespace-nowrap flex items-center">
						<div class="w-2 h-2 mr-2 {getColor(sl)} rounded-full" />
						{ProblemData[sl].name} ({problemCount[sl]})
					</Card.Content>
				</Card.Root>
			{/if}
		</div>
	{/each}
</div>
