<script lang="ts">
	// TODO: Dropdown styling for event selection (worst case might have to use some package)
	// TODO: UID validation
	// TODO: Previews similar to dropzone and THE manual tagging modal (steal from profile but server part needs to be thought)
	// TODO: Get events data from database
	// TODO: Discuss what type of filters are needed

	let uid = '';
	const events = ['atmos', 'pearl'];
	let selectedEvent = events[0];
</script>

<main>
	<form class="p-2 text-lg">
		<div class="p-4">
			<label for="uid" class="mr-3 font-bold">UID to search:</label>
			<input
				type="text"
				name="uid"
				id="uid"
				class="rounded-sm px-3 outline outline-1 outline-primary-800/25 placeholder:text-lg placeholder:italic focus:outline-primary-800"
				placeholder="fxxxxxxxx"
				bind:value={uid}
			/>
		</div>
		<div class="p-4">
			<label for="event" class="mr-3 font-bold">Select event:</label>
			<select name="event" id="event" bind:value={selectedEvent}>
				{#each events as event}
					<option value={event}>{event}</option>
				{/each}
			</select>
		</div>
		<div />
	</form>
</main>
