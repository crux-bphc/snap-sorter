<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<Navbar />

<!-- TODO: Get name and profile from server.ts => providerUser to db -->
<h1>Profile</h1>
<h2>User id: {data.user.userId}</h2>
<h2>Email: {data.user.email}</h2>
