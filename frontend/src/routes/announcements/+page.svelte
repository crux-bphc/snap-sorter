<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { fly, fade } from 'svelte/transition';

	export let data: PageData;
	export let loaded = false;

	onMount(() => (loaded = true));
</script>

{#if loaded}
	<main class="p-4">
		<h1 class="text-center text-5xl font-bold" in:fade>Announcements</h1>

		{#each data.announcements as announcement}
			<article
				class="my-4 rounded-md border border-primary-600 p-3 shadow-xl"
				in:fly={{ x: -300, duration: 500 }}
			>
				<h2 class="p-2 text-3xl font-bold">{announcement.title}</h2>
				<p class="p-2 text-lg">{announcement.details}</p>
			</article>
		{/each}
	</main>
{/if}
