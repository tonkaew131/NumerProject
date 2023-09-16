<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import Skeleton from './ui/skeleton/skeleton.svelte';

	import * as Table from '$lib/components/ui/table';
	import KaTeX from './kaTeX.svelte';
	import { onMount } from 'svelte';

	// import type { PageData } from './$types';
	// export let data: PageData;

	let stats: any = null;

	onMount(() => {
		const fetchStats = async () => {
			const res = await fetch('/api/stats');
			const data = await res.json();

			stats = data;
		};

		fetchStats();
	});
</script>

<div class="mt-12 pt-5 grid grid-cols-4 w-fit mx-auto gap-3 dark">
	<Card.Root>
		<Card.Content class="pb-0 py-8">
			<Skeleton class="w-14 h-10" />
			<p class="font-black my-0 tracking-widest text-muted-foreground">PROBLEMS SOLVED</p>
		</Card.Content>
	</Card.Root>
	<Card.Root>
		<Card.Content class="pb-0 py-8">
			{#if stats?.data?.userCount}
				<h1 class="p-0 m-0 text-primary">{stats.data.userCount}</h1>
			{:else}
				<Skeleton class="w-14 h-10" />
			{/if}
			<p class="font-black my-0 tracking-widest text-muted-foreground">USERS</p>
		</Card.Content>
	</Card.Root>
	<Card.Root>
		<Card.Content class="pb-0 py-8">
			<Skeleton class="w-14 h-10" />
			<p class="font-black my-0 tracking-widest text-muted-foreground">VIEWS</p>
		</Card.Content>
	</Card.Root>
	<Card.Root>
		<Card.Content class="pb-0 py-8">
			<Skeleton class="w-14 h-10" />
			<p class="font-black my-0 tracking-widest text-muted-foreground">TOTAL EXECUTED TIME</p>
		</Card.Content>
	</Card.Root>
</div>

<Card.Root class="w-fit mx-auto mt-12">
	<Card.Content class="w-fit mx-auto pb-0">
		<Table.Root class="w-fit mx-auto border ">
			<Table.Caption>Most recent solved problems</Table.Caption>
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
				{#each Array(5) as _, idx}
					<Table.Row>
						<Table.Cell class="border-x text-center">{5 - idx}</Table.Cell>
						<Table.Cell class="border-x">
							<div class="w-64 truncate">
								<KaTeX data={`3x_1 + 4x_1 = 50`} />
							</div>
						</Table.Cell>
						<Table.Cell class="w-36 truncate border-x">FROGKun</Table.Cell>
						<!-- <Table.Cell class="border-x">{3 + idx * 2} minutes ago</Table.Cell> -->
						<Table.Cell class="border-x"
							><span class="text-green-700">15:24</span> 15/Sep/2023</Table.Cell
						>
						<Table.Cell class="text-center border-x">4</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</Card.Content>
</Card.Root>
