// Pitfalls:
// Relying on <Group> from mantine does not seem like a good idea. Try replacing them with normal html elements and style with tailwind
import BaseLayout from "@/components/layouts/BaseLayout";
import { Button, Group, MultiSelect, TextInput } from "@mantine/core";
import { useState } from "react";
import { YearPickerInput } from "@mantine/dates";
import ImageWithModal from "@/components/ImageWithModal";
import { prisma } from "../api/auth/[...nextauth]";
import { InferGetServerSidePropsType } from "next";

export const getServerSideProps = async () => {
	const events = await prisma.event.findMany();

	return {
		props: {
			events: JSON.parse(
				JSON.stringify(
					events.map((event) => ({
						value: event.id,
						label: `${event.name} ${event.year}`,
					}))
				)
			),
		},
	};
};

// TODO: Make the UI better for larger screens
export default function Search({
	events,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const [uid, setUid] = useState("");
	const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
	const [eventYear, setEventYear] = useState<Date | null>(new Date());
	const [images, setImages] = useState<
		{ id: string; imageUrl: string; tags: string[] }[]
	>([]);

	// TODO: Finish handleSearch
	async function handleSearch() {
		const response = await fetch("/api/searchImages", {
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

		console.log(await response.json());
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
