<script lang="ts">
	import Dropzone from 'svelte-file-dropzone/Dropzone.svelte';
	import Button from '$lib/components/Button.svelte';
	import type { DropEvent, FileRejection } from '$lib/types/dropzone';

	export let data;

	let files = {
		accepted: new Array<File>(),
		rejected: new Array<FileRejection>()
	};

	function handleFilesSelect(e: DropEvent) {
		const { acceptedFiles, fileRejections } = e.detail;
		files.rejected = fileRejections;
		files.accepted = [...files.accepted, ...acceptedFiles];
		files.accepted = files.accepted.filter(function (
			this: Set<string>,
			{ name, lastModified, size, type }
		) {
			const key = `${name}|${lastModified}|${size}|${type}`;
			return !this.has(key) && this.add(key);
		},
		new Set());
	}

	function uploadFiles() {
		// TODO: upload images to DB
		console.log(files.accepted);
	}
</script>

<main class="align-between mx-auto mb-auto flex flex-col gap-5">
	<div>
		<h1 class="my-3 text-3xl font-bold">Profile:</h1>
		<h2>User ID: {data.user.userId}</h2>
		<h2>Email: {data.user.email}</h2>
		<h2>Name: {data.user.name}</h2>
	</div>
	<div>
		<h1 class="my-3 text-xl font-semibold">Image Upload:</h1>
		<Dropzone on:drop={handleFilesSelect} accept={['image/*']} inputElement={null} />
		<ol class="mt-2">
			{#each files.rejected as item}
				<li class="text-sm font-semibold text-error-500">
					{item.file.name} has unsupported file format
				</li>
			{/each}
		</ol>
		<h2 class="mb-2 mt-4 text-lg font-semibold">Selected Images:</h2>
		<ol>
			{#each files.accepted as item}
				<li class="text-sm">{item.name} ({(item.size / 1000000).toFixed(2)} MB)</li>
			{/each}
		</ol>
		<Button type="submit" on:click={uploadFiles} color="success" size="small">Upload</Button>
	</div>
</main>
