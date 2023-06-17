<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	export let data;
</script>

<Navbar />

<!-- TODO: Get name and profile from server.ts => providerUser to db -->
<h1>Profile</h1>
<h2>User ID: {data.user.userId}</h2>
<h2>Email: {data.user.email}</h2>
<h2>Name: {data.user.name}</h2>
