// Pitfalls:
// Relying on <Group> from mantine does not seem like a good idea. Try replacing them with normal html elements and style with tailwind
import BaseLayout from "@/components/layouts/BaseLayout";
import { Button, Group, MultiSelect, TextInput } from "@mantine/core";
import { useState } from "react";
import { YearPickerInput } from "@mantine/dates";
import ImageWithModal from "@/components/ImageWithModal";

type Event = {
	value: string;
	label: string;
};

export default function Search() {
	const [uid, setUid] = useState("");
	const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
	const [eventYear, setEventYear] = useState<Date | null>(new Date());
	const [events, setEvents] = useState<Event[]>([]);
	const [images, setImages] = useState<
		{ id: string; imageUrl: string; tags: string[] }[]
	>([]);

	async function fetchEvents() {
		const response = await fetch(`/api/events?eventYear=${eventYear}`);
		// TODO: Handle errors
		const availableEvents: Event[] = await response.json();
		setEvents(availableEvents);
	}

	async function handleSearch() {
		const userImagesResponse = await fetch("/api/searchImages", {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				events: selectedEvents,
				eventYear,
				uid,
			}),
		});
		const { userImages } = await userImagesResponse.json();

		const arr = [];
		for (const image of userImages.flat()) {
			const imageResponse = await fetch("/api/getImage", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					filePath: image.filePath,
				}),
			});
			const imageUrl = URL.createObjectURL(await imageResponse.blob());
			arr.push({ id: image.filePath, imageUrl, tags: [] });
		}
		setImages(arr);
	}

	const previews = images.map(({ id, imageUrl, tags }, index) => {
		return (
			<ImageWithModal
				key={index}
				id={id}
				imageUrl={imageUrl}
				tagsFromDatabase={tags}
			/>
		);
	});

	return (
		<BaseLayout>
			<main>
				<section className="mx-auto max-w-md px-10 py-4">
					<form onSubmit={(event) => event.preventDefault()}>
						<article>
							{/* TODO: Regex validation for BITS UIDs */}
							<TextInput
								value={uid}
								label="UID"
								placeholder="fxxxxxxxx"
								onChange={(event) => setUid(event.currentTarget.value)}
								required
								withAsterisk
							/>
							<MultiSelect
								data={events}
								placeholder="Pick events"
								label="Events"
								onChange={setSelectedEvents}
								value={selectedEvents}
								clearButtonProps={{ "aria-label": "Clear selection" }}
								searchable
								clearable
								required
								withAsterisk
							/>
						</article>
						<article>
							<Group position="center" className="m-2">
								<YearPickerInput
									label="Event year"
									value={eventYear}
									onChange={setEventYear}
									withAsterisk
									maxDate={new Date()}
								/>
							</Group>
							<Group position="center">
								<Button type="submit" color="green" onClick={handleSearch}>
									Search
								</Button>
							</Group>
						</article>
					</form>
				</section>

				<section className="px-10">
					<div
						className={`mt-5 grid grid-cols-1 gap-4 py-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5`}>
						{previews}
					</div>
				</section>
			</main>
		</BaseLayout>
	);
}
