<script>
	import Input from './input.svelte';

	let inputData = {
		xStart: '',
		xEnd: '',
		formula: '',
		errorFactor: 0.000001
	};

	let modalMessage = {
		title: '',
		description: ''
	};
	let loading = false;
</script>

<svelte:head>
	<title>Single Trapezoidal Rule</title>
	<meta name="description" content="Single Trapezoidal Rule - Numerical Integration" />
</svelte:head>

<h3 class="text-center">🥹 Single Trapezoidal Rule</h3>

<Input
	bind:xStart={inputData.xStart}
	bind:xEnd={inputData.xEnd}
	bind:formula={inputData.formula}
	onClickCalculate={() => console.log('clicked!')}
/>
