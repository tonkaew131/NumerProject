<script lang="ts">
	import '../app.postcss';

	import Button from '$lib/components/ui/button/button.svelte';
	import * as Avatar from '$lib/components/ui/avatar';
	import * as Sheet from '$lib/components/ui/sheet';
	import Icon from '@iconify/svelte';

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
				<Button class="w-full mt-4 flex items-center gap-1" variant="outline">
					<Icon icon="devicon:google" />
					Google
				</Button>
			</Sheet.Description>
		</Sheet.Header>
	</Sheet.Content>
</Sheet.Root>

<main class="bg-primary-foreground min-h-screen max-h-full">
	<div class="bg-white w-full border border-border py-2 flex items-center">
		<p class="mx-auto ml-0 px-8 font-black text-red-500">TKW</p>
		<!-- <Avatar.Root class="mr-2">
			<Avatar.Image
				src="https://thicc.mywaifulist.moe/waifus/megumi-kato-saekano-how-to-raise-a-boring-girlfriend/ceNOxduzpjj2Rp3NEfB5r6PvHw8g3E1GwQLFZaAy_thumbnail.jpg"
				alt="@shadcn"
			/>
			<Avatar.Fallback>CN</Avatar.Fallback>
		</Avatar.Root> -->
		<Button class="mr-8 font-bold" on:click={onLogin}>LOGIN</Button>
	</div>
	<slot />
</main>
