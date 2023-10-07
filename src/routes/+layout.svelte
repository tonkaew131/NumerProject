<script lang="ts">
	import '../app.postcss';

	import Navbar from '$lib/components/navbar.svelte';

	import type { PageData } from './$types';
	export let data: PageData;

	import Analytics from '$lib/components/analytics.svelte';
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
	<link
		href="https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@100;200;300;400;500;600;700;800;900&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<Analytics />
<main class="bg-primary-foreground min-h-screen max-h-full h-full">
	<Navbar {data} />
	<slot />
</main>
