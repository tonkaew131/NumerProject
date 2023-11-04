<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import * as Card from '$lib/components/ui/card';
	import * as Avatar from '$lib/components/ui/avatar';
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
					</Table.Row>
				</Table.Header>
				<Table.Body>
					<Table.Row>
						<Table.Cell class="font-medium">fso04mmmhne2efx</Table.Cell>
						<Table.Cell class="flex items-center gap-4">
							<Avatar.Root>
								<Avatar.Image
									src="https://lh3.googleusercontent.com/a/ACg8ocLZSKovYWaCcau6BgLwIzzzzD5KAPJwNwZbXwERPwpaElI=s96-c"
									alt="@fso04mmmhne2efx"
								/>
								<Avatar.Fallback>FK</Avatar.Fallback>
							</Avatar.Root>
							FROGKun
						</Table.Cell>
					</Table.Row>
				</Table.Body>
			</Table.Root>
		</Card.Content>
	</Card.Root>
</div>
