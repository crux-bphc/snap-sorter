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
		<!-- TODO: make it dynamic depending on login state and page-->
		<Button type="button" color="yellow">
			<a href="/profile">profile</a>
		</Button>
		<Button type="button" color="success">
			<a href="/announcements">announcements</a>
		</Button>
		<Button type="button" color="purple">
			<a href="/search"> image search </a>
		</Button>
		<form use:enhance method="post" class="flex">
			<Button type="submit" color="error">Logout</Button>
		</form>
	</nav>
{/if}
