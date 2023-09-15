<script lang="ts">
	import '../app.postcss';

	import Navbar from '$lib/components/navbar.svelte';

	import type { PageData } from './$types';
	export let data: PageData;
</script>

<main class="bg-primary-foreground min-h-screen max-h-full">
	<Navbar {data} />
	<slot />
</main>
