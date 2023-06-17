<script lang="ts">
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import Button from './Button.svelte';
	let mounted = false;
	onMount(() => (mounted = true));
</script>

{#if mounted}
	<nav class="flex flex-wrap justify-center md:justify-end" transition:fade>
		<!-- TODO: Add a toggle for color scheme -->
		<!-- TODO: search route page-->
		<Button type="button" color="purple">
			<a href="/search"> image search </a>
		</Button>
		<form use:enhance method="post" action="/profile?/logout" class="flex">
			<Button type="submit" color="error">Logout</Button>
		</form>
	</nav>
{/if}
