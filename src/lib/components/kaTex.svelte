<script lang="ts">
	import katex from 'katex';

	export let data;

	let str = '';
	try {
		str = katex.renderToString(data, {
			throwOnError: false
		});
	} catch (error) {
		console.log(error);
	}
</script>

<svelte:head>
	<link
		rel="stylesheet"
		href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css"
		integrity="sha384-GvrOXuhMATgEsSwCs4smul74iXGOixntILdUW9XmUC6+HX0sLNAK3q71HotJqlAn"
		crossorigin="anonymous"
	/>
</svelte:head>

{@html str}
