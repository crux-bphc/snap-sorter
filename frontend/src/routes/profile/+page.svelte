<script lang="ts">
	import { applyAction, deserialize, enhance } from '$app/forms';
	import Dropzone from 'svelte-file-dropzone/Dropzone.svelte';
	import Button from '$lib/components/Button.svelte';
	import type { DropEvent, FileRejection, ImageFile } from '$lib/types/dropzone';
	import type { ActionData, PageData } from './$types';
	import type { ActionResult } from '@sveltejs/kit';
	import { invalidateAll } from '$app/navigation';

	export let data: PageData;
	export let form: ActionData;

	let images: Array<ImageFile> = [];
	let rejected: Array<FileRejection> = [];

	function handleFilesSelect(e: DropEvent) {
		const { acceptedFiles, fileRejections } = e.detail;
		rejected = fileRejections;

		acceptedFiles.forEach((file) => {
			file.id = `${file.name}|${file.lastModified}|${file.size}|${file.type}`;
		});
		images = [...images, ...acceptedFiles];
		images = images.filter(function (this: Set<string>, { id }) {
			return !this.has(id) && this.add(id);
		}, new Set());

		loadPreview();
	}

	async function uploadFiles(this: HTMLFormElement) {
		let fd = new FormData();

		fd.append('length', images.length.toString());
		for (let i = 0; i < images.length; i++) {
			fd.append(i.toString(), images[i]);
		}

		const response = await fetch(this.action, {
			method: 'POST',
			body: fd
		});

		const result: ActionResult = deserialize(await response.text());

		if (result.type === 'success') {
			await invalidateAll();
		}

		applyAction(result);
	}

	function readFile(file: File): Promise<HTMLImageElement> {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = (e) => {
				let img = new Image();
				img.src = e.target?.result?.toString() ?? '';
				img.onload = () => resolve(img);
			};
			reader.onerror = reject;
			reader.readAsDataURL(file);
		});
	}

	function loadPreview() {
		const fileReadPromises = images.map((file) => readFile(file));
		Promise.all(fileReadPromises)
			.then((arr) => {
				images.forEach((file, i) => {
					file.src = arr[i].src;
					file.width = arr[i].width;
					file.height = arr[i].height;
				});
				images = images;
			})
			.catch((err) => {
				console.error(err.message);
			});
	}
</script>

<main class="align-between m-auto flex flex-col gap-5">
	<div>
		<h1 class="my-3 text-3xl font-bold">Profile:</h1>
		<h2>Email: {data.user.email}</h2>
		<h2>Name: {data.user.name}</h2>
	</div>
	<div class="mx-auto">
		<form method="POST" action="?/upload" on:submit|preventDefault={uploadFiles}>
			<Button type="submit" color="success" size="small">Upload</Button>
			<Button on:click={() => (images = [])} color="error" size="small">clear selection</Button>
		</form>
		{#if form?.error}
			<p class="text-error-500">{form.error}</p>
		{/if}
		{#if form?.message}
			<p class="text-forestGreen-500">{form.message}</p>
		{/if}
	</div>
	<div>
		<h1 class="my-3 text-xl font-semibold">Image Upload:</h1>
		<Dropzone on:drop={handleFilesSelect} accept={['image/*']} inputElement={null} />
		<ol class="mt-2">
			{#each rejected as item}
				<li class="text-sm font-semibold text-error-500">
					{item.file.name} has unsupported file format
				</li>
			{/each}
		</ol>
		{#if images.length > 0}
			<h2 class="mb-2 mt-4 text-lg font-semibold">Selected Images:</h2>
			<div
				class="mb-4 grid grid-cols-2 place-items-stretch gap-4 bg-primary-50 sm:grid-cols-3 md:grid-cols-4"
			>
				{#each images as { src, height, width, name, size }}
					<div
						class="flex w-52 flex-col items-center justify-center gap-2 bg-purple-50 p-2"
						on:mouseenter={() => {
							// TODO: Add delete button/icon for each image
						}}
					>
						<img alt={name} {src} class="max-h-48" />
						<p class="text-center text-sm font-semibold text-purple-500">
							{name} ({(size / 1000000).toFixed(2)} MB)
						</p>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</main>
