<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';
	import Button from '$lib/components/Button.svelte';
	export let data: PageData;
</script>

<h1>Profile</h1>
<h2>User id: {data.user.userId}</h2>
<h2>Email: {data.user.email}</h2>

<form use:enhance method="post">
	<Button type="submit" color="primary">Logout</Button>
</form>
