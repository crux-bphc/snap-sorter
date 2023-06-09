<script lang="ts">
	import clsx from 'clsx';

	const colorVariants = {
		primary: 'bg-primary-800 hover:bg-primary-700 text-primary-200 hover:shadow-xl',
		yellow: 'bg-yellow-800 hover:bg-yellow-700 text-yellow-200 hover:shadow-xl',
		orange: 'bg-yellow-800 hover:bg-yellow-700 text-orange-200 hover:shadow-xl',
		purple: 'bg-purple-800 hover:bg-purple-700 text-purple-200 hover:shadow-xl',
		error: 'bg-error-800 hover:bg-error-700 text-error-200 hover:shadow-xl',
		success: 'bg-forestGreen-800 hover:bg-forestGreen-700 text-forestGreen-200 hover:shadow-xl'
	};

	const sizeVariants = {
		small: 'px-2 py-2 mx-1 my-1 text-sm',
		medium: 'px-4 py-2 mx-2 my-2 text-xl',
		large: 'px-6 py-3 mx-3 my-3 text-2xl'
	};

	export let type: 'button' | 'submit' | 'reset' = 'button';
	export let padding = 'px-4 py-2';
	export let margin = 'mx-1 my-1';
	export let color: keyof typeof colorVariants = 'primary';
	export let size: keyof typeof sizeVariants = 'medium';

	// Additional classes if needed.
	// Need to be careful when using as the outcome may not be what one wants because of the way precedence in tailwind works
	export let classes = '';
</script>

<button
	{type}
	on:click
	class={clsx(
		colorVariants[color],
		padding,
		margin,
		'rounded font-bold capitalize transition-all ease-in-out hover:duration-150',
		sizeVariants[size],
		classes
	)}><slot /></button
>
