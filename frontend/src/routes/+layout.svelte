<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import { onMount } from 'svelte';
	import '../app.css';
	import Navbar from '$lib/components/Navbar.svelte';

	// For the fade transition when the page loads
	let loaded = false;
	onMount(() => (loaded = true));
</script>

{#if loaded}
	<div class="flex min-h-screen flex-col">
		<Navbar />
		<slot />
		<Footer />
	</div>
{/if}
