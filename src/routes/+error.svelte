<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="prose text-center mx-auto h-[80vh] flex flex-col justify-center items-center">
	<h1 class="my-0 py-0 w-fit text-6xl">
		{$page.status}
	</h1>
	<h2 class="my-0 py-0 w-fit">
		{$page.error?.message}
	</h2>
</div>
