<script lang="ts">
	import { page } from '$app/stores';
	import { browser } from '$app/environment';

	import * as Card from '$lib/components/ui/card';
	import Button from './ui/button/button.svelte';

	const MEASUREMENT_ID = 'G-1F8VCX7W86';

	$: {
		if (typeof gtag !== 'undefined') {
			gtag('config', MEASUREMENT_ID, {
				page_title: document.title,
				page_path: $page.url.pathname
			});

			const isConsent: boolean = localStorage.getItem('consent') === 'true';
		}
	}

	async function consentAccept() {
		localStorage.setItem('consent', 'true');
		gtag('consent', 'update', {
			ad_storage: 'granted',
			analytics_storage: 'granted'
		});
		location.reload();
	}

	async function consentDeny() {
		localStorage.setItem('consent', 'false');
		gtag('consent', 'update', {
			ad_storage: 'denied',
			analytics_storage: 'denied'
		});
		location.reload();
	}
</script>

<svelte:head>
	<script async src="https://www.googletagmanager.com/gtag/js?id={MEASUREMENT_ID}">
	</script>
	{@html `<script>
        const MEASUREMENT_ID = "${MEASUREMENT_ID}";
    </script>`}
	<script>
		window.dataLayer = window.dataLayer || [];

		function gtag() {
			dataLayer.push(arguments);
		}

		gtag('js', new Date());
		gtag('config', MEASUREMENT_ID);

		if (localStorage.getItem('consent') === null) {
			console.log('Denied consent');
			gtag('consent', 'default', {
				ad_storage: 'denied',
				analytics_storage: 'denied'
			});
		} else if (localStorage.getItem('consent') === 'true') {
			console.log('Accepted consent');
			gtag('consent', 'default', {
				ad_storage: 'granted',
				analytics_storage: 'granted'
			});
		}
	</script>
</svelte:head>

{#if browser && !localStorage.getItem('consent')}
	<Card.Root
		class="fixed left-1/2 -translate-x-1/2 bottom-2 z-50 w-11/12 max-w-[min(36rem,_95%)] p-2 px-8 text-sm"
	>
		<Card.Header class="p-0 py-2 m-0">
			<Card.Title>This website uses non-necessary cookies</Card.Title>
			<!-- <Card.Description>Card Description</Card.Description> -->
		</Card.Header>
		<Card.Content class="p-0">
			<p>
				We use cookies to enhance performance and improve the user experience on the website. You
				can customize your cookie consent settings. <a href="/cookie" class="anchor"
					>How do we use cookies?</a
				>
			</p>
			<div class="py-2">
				<Button on:click={consentAccept} variant="ghost-success">Accept 🥺</Button>
				<Button on:click={consentDeny} variant="ghost-destructive">Denied</Button>
			</div>
		</Card.Content>
	</Card.Root>
{/if}
