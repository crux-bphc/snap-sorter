<script lang="ts">
	import Dropzone from 'svelte-file-dropzone/Dropzone.svelte';
	import Button from '$lib/components/Button.svelte';
	import type { DropEvent, FileRejection, ImageFile } from '$lib/types/dropzone';

	export let data;

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

	function uploadFiles() {
		// TODO: upload images to DB
		console.log(images);
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
		<Button type="submit" on:click={uploadFiles} color="success" size="small">Upload</Button>
		<Button type="submit" on:click={() => (images = [])} color="error" size="small"
			>clear selection</Button
		>
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
				class="mb-4 grid grid-cols-2 place-items-stretch gap-4 bg-primary-200 sm:grid-cols-3 md:grid-cols-4"
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
