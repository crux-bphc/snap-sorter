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
	<main
		class="mt-[-2.5rem] flex min-h-screen flex-col items-center justify-center text-center"
		transition:fade
	>
		<h1 class="m-4 text-7xl font-bold text-primary-600">Snap Sorter</h1>
		<Button type="submit" color="primary" size="large"
			><a href="/api/oauth" class="flex items-center gap-3"
				>Login with Google <Icon icon={googleIcon} /></a
			></Button
		>
		<p class="text-[0.8rem] font-bold text-primary-500">*Use your BITS email to login</p>
	</main>
{/if}
