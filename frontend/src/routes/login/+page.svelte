<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Icon from '@iconify/svelte';
	import googleIcon from '@iconify/icons-mdi/google';
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';

	// For the fade transition when the page loads
	// TODO:Evaluate later whether this needs ot become a separate wrapper component
	let loaded = false;
	onMount(() => (loaded = true));
</script>

{#if loaded}
	<main class="m-auto flex flex-col items-center justify-center text-center" transition:fade>
		<h1 class="text-primary-600 m-4 text-7xl font-bold">Snap Sorter</h1>
		<Button type="submit" color="primary" size="large"
			><a href="/api/oauth" class="flex items-center gap-3"
				>Login with Google <Icon icon={googleIcon} /></a
			></Button
		>
		<p class="text-primary-500 text-[0.8rem] font-bold">*Use your BITS email to login</p>
	</main>
{/if}
