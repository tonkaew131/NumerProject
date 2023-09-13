<script lang="ts">
	import katex from 'katex';

	import type { PageData } from '../../routes/$types';
	let data: PageData;
</script>

<svelte:head>
	<link
		rel="stylesheet"
		href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css"
		integrity="sha384-GvrOXuhMATgEsSwCs4smul74iXGOixntILdUW9XmUC6+HX0sLNAK3q71HotJqlAn"
		crossorigin="anonymous"
	/>
</svelte:head>

{@html katex.renderToString('c = \\pm\\sqrt{a^2 + b^2}', {
	throwOnError: false
})}
