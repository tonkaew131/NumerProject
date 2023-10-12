<script lang="ts">
	import { onMount } from 'svelte';

	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';

	import Skeleton from './ui/skeleton/skeleton.svelte';

	let stats: any = null;
	let totalTime: { [unit: string]: number } = {
		s: 0,
		ms: 0
	};

	onMount(() => {
		const fetchStats = async () => {
			const res = await fetch('/api/stats');
			const data = await res.json();

			stats = data;

			let timeMillis = stats.data.totalExecutedTime;
			totalTime.s = Math.floor(timeMillis / 1000);
			totalTime.ms = timeMillis % 1000;
		};

		fetchStats();
	});
</script>

<div class="mt-12 pt-5 grid grid-cols-2 lg:grid-cols-4 w-fit mx-auto gap-3 dark">
	<Card.Root>
		<Card.Content class="pb-0 py-8">
			{#if stats?.data?.totalProblemSolved != null || stats?.data?.totalProblemSolved != undefined}
				<h1 class="p-0 m-0 text-violet-500">{stats.data.totalProblemSolved}</h1>
			{:else}
				<Skeleton class="w-14 h-10 bg-violet-500" />
			{/if}
			<p class="font-black my-0 tracking-widest text-muted-foreground">PROBLEMS SOLVED</p>
		</Card.Content>
	</Card.Root>
	<Card.Root>
		<Card.Content class="pb-0 py-8">
			{#if stats?.data?.userCount != null || stats?.data?.userCount != undefined}
				<h1 class="p-0 m-0 text-primary">{stats.data.userCount}</h1>
			{:else}
				<Skeleton class="w-6 h-10 bg-primary" />
			{/if}
			<p class="font-black my-0 tracking-widest text-muted-foreground">USERS</p>
		</Card.Content>
	</Card.Root>
	<Card.Root>
		<Card.Content class="pb-0 py-8">
			{#if stats?.data?.totalView != null || stats?.data?.totalView != undefined}
				<h1 class="p-0 m-0 text-orange-500">{stats.data.totalView}</h1>
			{:else}
				<Skeleton class="w-14 h-10 bg-orange-500" />
			{/if}
			<p class="font-black my-0 tracking-widest text-muted-foreground">VIEWS</p>
		</Card.Content>
	</Card.Root>
	<Card.Root>
		<Card.Content class="pb-0 py-8">
			<span class="flex items-end gap-2">
				{#if stats?.data?.totalExecutedTime !== undefined && stats?.data?.totalExecutedTime !== null}
					{#each Object.keys(totalTime) as unit}
						<div class="flex items-end gap-[0.1rem]">
							<h1 class="p-0 m-0 text-green-500">{totalTime[unit]}</h1>
							<h2 class="p-0 m-0 text-green-500/50">{unit}</h2>
						</div>
					{/each}
				{:else}
					<Skeleton class="w-16 h-10 bg-green-500" />
					<h2 class="p-0 m-0 text-green-500/50">ms</h2>
				{/if}
			</span>
			<p class="font-black my-0 tracking-widest text-muted-foreground">TOTAL EXECUTED TIME</p>
		</Card.Content>
	</Card.Root>
</div>

<Card.Root class="w-fit overflow-auto max-w-full mx-auto mt-12">
	<Card.Content class="w-fit mx-auto pb-0">
		<Table.Root class="w-fit mx-auto border ">
			<Table.Caption>5 Most recent solved problems</Table.Caption>
			<Table.Header>
				<Table.Row>
					<Table.Head class="w-12 border-x text-center">ID</Table.Head>
					<Table.Head class="border-x">Problem</Table.Head>
					<Table.Head class="border-x text-center">User</Table.Head>
					<Table.Head class="border-x text-center">Date</Table.Head>
					<Table.Head class="border-x text-center">Iterations</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#if stats?.data?.mostRecentSolutions != null}
					{#each stats.data.mostRecentSolutions as sl}
						<Table.Row>
							<Table.Cell class="border-x text-center">
								<a href={`/s/${sl.id}`}>{sl.id}</a>
							</Table.Cell>
							<Table.Cell class="border-x">
								<div class="w-64 truncate">
									{JSON.stringify(sl.problem.input)}
								</div>
							</Table.Cell>
							<Table.Cell class="w-36 truncate border-x"
								>{sl?.solved_by?.google_name || '-'}</Table.Cell
							>
							<!-- <Table.Cell class="border-x">{3 + idx * 2} minutes ago</Table.Cell> -->
							<Table.Cell class="border-x font-noto">
								{@const date = new Date(sl.solved_at)}
								<span class="text-green-700">{date.toLocaleTimeString('th-th')}</span>
								{date.toLocaleDateString('th-th', {
									year: 'numeric',
									month: 'long',
									day: 'numeric'
								})}
							</Table.Cell>
							<Table.Cell class="text-center border-x">
								{sl.iteration_count}
							</Table.Cell>
						</Table.Row>
					{/each}
				{:else}
					{#each [1, 2, 3, 4, 5] as _}
						<Table.Row>
							<Table.Cell class="border-x text-center">
								<Skeleton class="h-5 w-14" />
							</Table.Cell>
							<Table.Cell class="border-x">
								<Skeleton class="h-5 w-64" />
							</Table.Cell>
							<Table.Cell class="border-x">
								<Skeleton class="h-5 w-20" />
							</Table.Cell>
							<Table.Cell class="border-x">
								<Skeleton class="h-5 w-40" />
							</Table.Cell>
							<Table.Cell class="border-x text-center">
								<Skeleton class="h-5 w-4 mx-auto" />
							</Table.Cell>
						</Table.Row>
					{/each}
				{/if}
			</Table.Body>
		</Table.Root>
	</Card.Content>
</Card.Root>
