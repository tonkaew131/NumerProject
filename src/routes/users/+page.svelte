<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import * as Card from '$lib/components/ui/card';
	import * as Avatar from '$lib/components/ui/avatar';
	import { onMount } from 'svelte';
	import createUsersStore from './users-store';
	import KaTeX from '$lib/components/KaTex.svelte';

	onMount(() => {
		createUsersStore.fetchUsers();
	});
</script>

<svelte:head>
	<title>Users | TKW</title>
</svelte:head>

<div class="prose mx-auto max-w-6xl pt-16 pb-48 w-11/12 font-noto">
	<h2 class="text-center">Users 🐪</h2>

	<Card.Root>
		<Card.Content class="pb-0">
			<Table.Root>
				<Table.Caption>A list of our top users.</Table.Caption>
				<Table.Header>
					<Table.Row>
						<Table.Head class="w-[100px]">User Id</Table.Head>
						<Table.Head>Name</Table.Head>
						<Table.Head>Solutions solved</Table.Head>
						<Table.Head>Problem Type</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#if $createUsersStore.data}
						{#each $createUsersStore.data.data.users as us}
							<Table.Row>
								<Table.Cell class="font-medium">{us.id}</Table.Cell>
								<Table.Cell class="flex items-center gap-4">
									<Avatar.Root>
										<Avatar.Image src={us.google_profile} alt="@{us.id}" class="!my-0" />
										<Avatar.Fallback>FK</Avatar.Fallback>
									</Avatar.Root>
									{us.google_name}
								</Table.Cell>
								<Table.Cell>
									<KaTeX data={`\\infty`} />
								</Table.Cell>
								<Table.Cell>
									<div class="w-[12em] dark bg-background h-2 rounded-full flex overflow-clip">
										<div class="h-full w-[20%] bg-red-500 left-0" />
										<div class="h-full w-[50%] bg-lime-500" />
										<div class="h-full w-[5%] bg-yellow-500" />
										<div class="h-full w-[50%] bg-cyan-500" />
									</div>
								</Table.Cell>
							</Table.Row>
						{/each}
					{/if}
				</Table.Body>
			</Table.Root>
		</Card.Content>
	</Card.Root>
</div>
