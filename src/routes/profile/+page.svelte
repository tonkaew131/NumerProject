<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	console.log(data.user);
</script>

<svelte:head>
	<title>Profile</title>
</svelte:head>

<div class="prose mx-auto max-w-6xl pt-16 pb-48 w-11/12">
	{#if data.user}
		<h2 class="mb-0">
			{data.user.googleName}
		</h2>
		<p class="text-muted-foreground mt-0">
			{data.user.userId}
		</p>
		<img
			src="https://i.pinimg.com/originals/f2/d5/5a/f2d55ae2cd07ae2a4b5aa61cde061d4c.gif"
			alt="Cat Dancing GIF"
			loading="lazy"
		/>
	{/if}
</div>
