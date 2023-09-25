<script lang="ts">
	import { goto } from '$app/navigation';
	import Stats from '$lib/components/stats.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';

	import * as Select from '$lib/components/ui/select';

	let mode: string = '';
	let solutionMode: string = '';
	let precision: number = 6;

	function onChangeProblemType(e: any) {
		const value = e?.value;
		if (value == undefined) mode = '';
		else mode = String(value);

		solutionMode = '';
	}
</script>

<svelte:head>
	<title>Numerical methods calculator | TKW</title>
	<meta
		name="description"
		content="Numerical methods calculator made with love (for score) by @tonkaew131"
	/>
	<meta name="keywords" content="numerical, methods, calculator, tonkaew131" />
	<meta name="author" content="tonkaew131" />

	<meta name="viewport" content="width=device-width, initial-scale=1" />

	<meta name="theme-color" content="#ffffff" />
	<link rel="icon" type="image/x-icon" href="/favicon.ico" />
	<link rel="apple-touch-icon" href="/favicon.png" />

	<meta property="og:title" content="Numerical methods calculator | TKW" />
	<meta
		property="og:description"
		content="Numerical methods calculator made with love (for score) by @tonkaew131"
	/>
	<meta property="og:image" content="/webpanel.png" />
	<meta property="og:url" content="https://numer.wilar.in.th/" />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<div class="prose max-w-6xl mx-auto pt-16 pb-48 w-11/12">
	<h1 class="text-center w-fit mx-auto">
		Project of Numerical methods
		<div class="h-[2px] w-full bg-primary my-2 rounded-full" />
	</h1>

	<div class="flex gap-4 items-center flex-wrap justify-center">
		<Label class="flex items-center gap-2">
			Type of Problem:
			<Select.Root onSelectedChange={onChangeProblemType}>
				<Select.Trigger class="w-64 bg-white">
					<Select.Value placeholder="-" />
				</Select.Trigger>
				<Select.Content>
					<Select.Item class="hover:cursor-pointer" value="root">Root of Equation</Select.Item>
					<Select.Item class="hover:cursor-pointer" value="linear">
						Linear algebra equation
					</Select.Item>
					<Select.Item class="hover:cursor-pointer" value="interpolation">
						Interpolation / Extrapolation
					</Select.Item>
				</Select.Content>
			</Select.Root>
		</Label>

		<Label class="flex flex-wrap items-center gap-2">
			Solution:
			<Select.Root
				onSelectedChange={(e) => {
					const value = e?.value;
					if (typeof value !== 'string') return;

					goto(`/${value.replaceAll('-', '/')}`);
				}}
			>
				<Select.Trigger class="w-64 bg-white">
					<Select.Value placeholder="-" />
				</Select.Trigger>
				<Select.Content>
					{#if mode === 'root'}
						<Select.Item class="hover:cursor-pointer" value="root-graphical" disabled>
							Graphical methods
						</Select.Item>
						<Select.Item class="hover:cursor-pointer" value="root-bisection" disabled>
							Bisection search
						</Select.Item>
						<Select.Item class="hover:cursor-pointer" value="root-false" disabled>
							False-position methods
						</Select.Item>
						<Select.Item class="hover:cursor-pointer" value="root-one" disabled>
							One-point Iteration methods
						</Select.Item>
						<Select.Item class="hover:cursor-pointer" value="root-newton" disabled>
							Newton-Raphson methods
						</Select.Item>
						<Select.Item class="hover:cursor-pointer" value="root-secant" disabled>
							Secant methods
						</Select.Item>
					{:else if mode === 'linear'}
						<Select.Item class="hover:cursor-pointer" value="linear-cramer" disabled>
							Cramer's rule
						</Select.Item>
						<Select.Item class="hover:cursor-pointer" value="linear-guass">
							Guass elimination
						</Select.Item>
						<Select.Item class="hover:cursor-pointer" value="linear-jordan" disabled>
							Guass Jordan elimination
						</Select.Item>
						<Select.Item class="hover:cursor-pointer" value="linear-inversion" disabled>
							Matrix Inversion
						</Select.Item>
						<Select.Item class="hover:cursor-pointer" value="linear-jacobi" disabled>
							Jacobi Iteration Methods
						</Select.Item>
						<Select.Item class="hover:cursor-pointer" value="linear-conjugate" disabled>
							Conjugate Gradient Methods
						</Select.Item>
					{:else if mode === 'interpolation'}
						<Select.Item value="inter-newton">Newton divided-differences</Select.Item>
						<Select.Item value="inter-lagrange">Lagrange interpolation</Select.Item>
					{:else}
						<Select.Item class="hover:cursor-pointer" value="none" disabled>
							Please select type of problem
						</Select.Item>
					{/if}
				</Select.Content>
			</Select.Root>
		</Label>

		<Label class="flex items-center gap-2">
			Precision:
			<Input type="number" class="w-20 bg-white" placeholder="6" min="0" bind:value={precision} />
		</Label>
	</div>

	<Stats />
</div>
