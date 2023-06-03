<script lang="ts">
	import clsx from 'clsx';

	const colorVariants = {
		primary: 'bg-primary-800 hover:bg-primary-700 text-primary-200',
		yellow: 'bg-yellow-800 hover:bg-yellow-700 text-yellow-200',
		orange: 'bg-yellow-800 hover:bg-yellow-700 text-orange-200',
		purple: 'bg-purple-800 hover:bg-purple-700 text-purple-200',
		error: 'bg-error-800 hover:bg-error-700 text-error-200',
		success: 'bg-forestGreen-800 hover:bg-forestGreen-700 text-forestGreen-200'
	};

	export let type: 'button' | 'submit' | 'reset' = 'button';
	export let padding = 'px-4 py-2';
	export let margin = 'mx-1 my-1';
	export let color: keyof typeof colorVariants = 'primary';

	// Additional classes if needed.
	// Need to be careful when using as the outcome may not be what one wants because of the way precedence in tailwind works
	export let classes = '';
</script>

<button
	{type}
	on:click
	class={clsx(colorVariants[color], padding, margin, 'rounded font-bold capitalize', classes)}
	><slot /></button
>
