// Pitfalls:
// Relying on <Group> from mantine does not seem like a good idea. Try replacing them with normal html elements and style with tailwind
import BaseLayout from "@/components/layouts/BaseLayout";
import { Button, Group, MultiSelect, TextInput } from "@mantine/core";
import { useState } from "react";
import { YearPickerInput } from "@mantine/dates";
import ImageWithModal from "@/components/ImageWithModal";
import { prisma } from "../api/auth/[...nextauth]";
import { InferGetServerSidePropsType } from "next";

type Event = {
	value: string;
	label: string;
};

export const getServerSideProps = async () => {
	const events = await prisma.event.findMany({
		where: { year: new Date().getFullYear() },
	});

	return {
		props: {
			initialLoadEvents: events.map((event) => ({
				value: event.id,
				label: event.name,
			})),
		},
	};
};

export default function Search({
	initialLoadEvents,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const [uid, setUid] = useState("");
	const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
	const [eventYear, setEventYear] = useState<Date | null>(new Date());
	const [events, setEvents] = useState<Event[]>(initialLoadEvents);
	const [images, setImages] = useState<
		{ id: string; imageUrl: string; tags: string[] }[]
	>([]);

	async function fetchEvents(eventYear: Date | null) {
		const response = await fetch(`/api/events?eventYear=${eventYear}`);
		// TODO: Handle errors
		const availableEvents: Event[] = await response.json();
		setSelectedEvents([]);
		setEvents(availableEvents);
	}

	async function handleSearch() {
		const userImagesResponse = await fetch(
			`/api/searchImages?uid=${uid}&events=${JSON.stringify(selectedEvents)}`
		);
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
							<Group position="center" className="m-2">
								<YearPickerInput
									label="Event year"
									value={eventYear}
									onChange={(newDate) => {
										setEventYear(newDate);
										fetchEvents(newDate);
									}}
									withAsterisk
									maxDate={new Date()}
								/>
							</Group>
							<MultiSelect
								data={events}
								disabled={events.length === 0}
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
								<Button
									type="submit"
									color="green"
									onClick={handleSearch}
									disabled={selectedEvents.length === 0}>
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
