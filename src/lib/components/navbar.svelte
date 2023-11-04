<script lang="ts">
	import Icon from '@iconify/svelte';

	import { enhance } from '$app/forms';
	import * as Avatar from '$lib/components/ui/avatar';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Sheet from '$lib/components/ui/sheet';

	import type { PageData } from './$types';
	export let data: PageData;

	function onLogin(e: MouseEvent) {
		document.getElementById('sheet-trigger')?.click();
		return;
	}
</script>

<Sheet.Root>
	<Sheet.Trigger class="hidden" id="sheet-trigger" />
	<Sheet.Content>
		<Sheet.Header>
			<Sheet.Title>
				<p class="text-red-500 font-black text-center">TKW</p>
			</Sheet.Title>
			<Sheet.Description>
				<p class="px-8 text-center mx-auto">To bookmark, or save any problem you can login with</p>
				<a href="/login/google">
					<Button class="w-full mt-4 flex items-center gap-1" variant="outline">
						<Icon icon="devicon:google" />
						Google
					</Button>
				</a>
			</Sheet.Description>
		</Sheet.Header>
	</Sheet.Content>
</Sheet.Root>

<div class="bg-white w-full border border-border py-2 flex items-center font-noto">
	<a href="/" class="mx-auto ml-0 mr-0">
		<p class="px-8 font-black text-red-500 hover:cursor-pointer">TKW</p>
	</a>
	<a href="/users" class="mx-auto ml-0">
		<p class="px-2 font-bold hover:cursor-pointer text-sm text-primary">Users</p>
	</a>
	{#if data.user}
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				<Avatar.Root class="mr-2 lg:mr-6">
					<Avatar.Image src={data.user.googleProfile} alt={data.user.googleName} />
					<Avatar.Fallback>CN</Avatar.Fallback>
				</Avatar.Root>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content>
				<DropdownMenu.Group class="w-40">
					<DropdownMenu.Label>My Account</DropdownMenu.Label>
					<DropdownMenu.Separator />
					<DropdownMenu.Item>
						<a href="/profile" class="w-full">Profile</a>
					</DropdownMenu.Item>
					<DropdownMenu.Item>My Problem</DropdownMenu.Item>
					<DropdownMenu.Separator />
					<DropdownMenu.Item>
						<form method="POST" action="?/logout" use:enhance class="w-full">
							<button type="submit" class="w-full">Log out</button>
						</form>
					</DropdownMenu.Item>
				</DropdownMenu.Group>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	{:else}
		<Button class="mr-4 font-bold" variant="link" on:click={onLogin}>LOGIN</Button>
	{/if}
</div>
