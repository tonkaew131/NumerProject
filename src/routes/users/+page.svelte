<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import * as Card from '$lib/components/ui/card';
	import * as Avatar from '$lib/components/ui/avatar';
	import { onMount } from 'svelte';
	import createUsersStore from './users-store';
	import ProblemTypeBar from '$lib/components/users/problem-type-bar/problem-type-bar.svelte';

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
						<Table.Head>Name</Table.Head>
						<Table.Head class="text-center">Problems asked</Table.Head>
						<Table.Head>Problem Type</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#if $createUsersStore.data}
						{#each $createUsersStore.data.data.users as us}
							<Table.Row>
								<Table.Cell class="flex items-center gap-4">
									<Avatar.Root>
										<Avatar.Image src={us.google_profile} alt="@{us.id}" class="!my-0" />
										<Avatar.Fallback>TK</Avatar.Fallback>
									</Avatar.Root>
									<span class="font-bold">
										{us.google_name}
									</span>
									<span class="font-medium text-muted-foreground bg-muted px-2 py-1 rounded-md">
										{us.id}
									</span>
								</Table.Cell>
								<Table.Cell class="text-center font-mono">
									{Object.values(us.solutions)
										.reduce((acc, cur) => {
											return acc + cur;
										}, 0)
										.toString()}
								</Table.Cell>
								<Table.Cell>
									<ProblemTypeBar problemCount={us.solutions} />
								</Table.Cell>
							</Table.Row>
						{/each}
					{/if}
				</Table.Body>
			</Table.Root>
		</Card.Content>
	</Card.Root>
</div>
