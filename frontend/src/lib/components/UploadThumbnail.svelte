<script lang="ts">
	import Icon from '@iconify/svelte';
	import closeCircle from '@iconify/icons-mdi/close-circle';

	export let name: string;
	export let src: string;
	export let size: number;
	export let id: string;
	export let removeImage: (id: string) => void;
</script>

<div class="flex w-52 flex-col items-center justify-center gap-2 bg-purple-50 p-2" {id}>
	<div class="flex max-h-48 flex-col items-center justify-center">
		<button class="absolute" on:click={() => removeImage(id)}>
			<Icon icon={closeCircle} class="z-10 h-16 w-16 opacity-0 hover:opacity-50" />
		</button>
		<img alt={name} {src} class="max-h-48" />
	</div>
	<p class="text-center text-sm font-semibold text-purple-500">
		{name} ({(size / 1000000).toFixed(2)} MB)
	</p>
</div>
