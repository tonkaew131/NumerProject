<script lang="ts">
	import '../app.postcss';

	import Button from '$lib/components/ui/button/button.svelte';
	import * as Avatar from '$lib/components/ui/avatar';
</script>

<main class="bg-primary-foreground min-h-screen max-h-full">
	<div class="bg-white w-full border border-border py-2 flex items-center">
		<p class="mx-auto ml-0 px-4 font-black text-red-500">TKW</p>
		<Avatar.Root class="mr-2">
			<Avatar.Image
				src="https://thicc.mywaifulist.moe/waifus/megumi-kato-saekano-how-to-raise-a-boring-girlfriend/ceNOxduzpjj2Rp3NEfB5r6PvHw8g3E1GwQLFZaAy_thumbnail.jpg"
				alt="@shadcn"
				/>
			<Avatar.Fallback>CN</Avatar.Fallback>
		</Avatar.Root>
		<!-- <Button class="mr-2 font-bold">LOGIN</Button> -->
	</div>
	<slot />
</main>
