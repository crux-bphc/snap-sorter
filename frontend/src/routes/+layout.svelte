<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import { onMount } from 'svelte';
	import '../app.css';

	// For the fade transition when the page loads
	let loaded = false;
	onMount(() => (loaded = true));
</script>

<slot />
{#if loaded}
	<Footer />
{/if}
