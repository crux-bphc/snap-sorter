// File which handles the user profile
// Pitfalls:
// <p> tags margin reset
// Possibly remove <Group> and <Image> from mantine and use regular html tags
// !There's no max file size limit or max number of files limit
import BaseLayout from "@/components/layouts/BaseLayout";
import { useState } from "react";
import {
	Image,
	Text,
	Group,
	Button,
	ActionIcon,
	Alert,
	Stack,
	Select,
} from "@mantine/core";
import { Dropzone, FileWithPath } from "@mantine/dropzone";
import { Icon } from "@iconify/react";
import { useSession } from "next-auth/react";
import { prisma } from "../api/auth/[...nextauth]";
import { InferGetServerSidePropsType } from "next";

export const getServerSideProps = async () => {
	const events = await prisma.event.findMany();
	return {
		props: { events },
	};
};

export default function Profile({
	events,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const [images, setImages] = useState<FileWithPath[]>([]);
	const [uploadStatus, setUploadStatus] = useState("");

	const { data: session } = useSession();
	const isDopy = session?.user.role === "dopy";
	const [event, setEvent] = useState<string | null>(null);

	const handleImageUpload = async function () {
		const fd = new FormData();
		if (isDopy) {
			if (event === null) return;
			fd.append("event", event);
		}
		for (const file of images) {
			fd.append("files[]", file);
		}

		const res = await fetch("/api/uploadFiles", {
			method: "POST",
			body: fd,
		});

		setUploadStatus(res.ok ? "success" : "failure");
	};

	const previews = images.map((file, index) => {
		const imageUrl = URL.createObjectURL(file);

		return (
			<div key={index} className="group relative">
				<Image
					alt={imageUrl}
					src={imageUrl}
					imageProps={{ onLoad: () => URL.revokeObjectURL(imageUrl) }}
				/>
				<ActionIcon
					className="absolute bottom-1 right-1 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"
					color="red"
					variant="filled"
					onClick={() => {
						setImages((images) => images.filter((_, key) => key !== index));
					}}>
					<Icon icon="mdi:delete" className="text-3xl" />
				</ActionIcon>
			</div>
		);
	});

	return (
		<BaseLayout>
			<main className="px-10 py-7">
				<div className="container mx-auto flex flex-col text-center">
					<section>
						<h1 className="my-2 text-3xl">
							{!isDopy ? "Profile" : "Image Upload"}
						</h1>
						{!isDopy && (
							<>
								<p className="m-1">
									<b>Name:</b> {session?.user.name}
								</p>
								<p className="m-1">
									<b>Email:</b> {session?.user.email}
								</p>
							</>
						)}
					</section>

					<section>
						<Stack align="center" className="py-5">
							{isDopy && (
								<Select
									error={event === null}
									placeholder="Select event"
									data={events.map((event) => ({
										value: event.id,
										label: event.name,
									}))}
									value={event}
									onChange={setEvent}
								/>
							)}
							<Group position="center">
								<Button
									type="submit"
									color="green"
									onClick={handleImageUpload}
									disabled={images.length === 0 || (isDopy && event === null)}>
									Upload
								</Button>
								<Button
									type="button"
									color="red"
									onClick={() => {
										setImages([]);
										setUploadStatus("");
									}}
									disabled={images.length === 0 || (isDopy && event === null)}>
									Reset
								</Button>
							</Group>
							{uploadStatus === "failure" && (
								<Alert
									className="px-5 pt-5"
									icon={<Icon icon="mdi:alert-circle-outline" />}
									title="File upload failed!"
									color="red"
									radius="md"
									withCloseButton
									onClose={() => setUploadStatus("")}>
									{}
								</Alert>
							)}
							{uploadStatus === "success" && (
								<Alert
									className="px-5 pt-5"
									icon={<Icon icon="mdi:check-circle-outline" />}
									title="Uploaded files successfully!"
									color="green"
									radius="md"
									withCloseButton
									onClose={() => setUploadStatus("")}>
									{}
								</Alert>
							)}
						</Stack>
						<Dropzone
							accept={["image/jpeg", "image/png"]}
							onDrop={setImages}
							maxFiles={5}>
							<Text align="center">Drop images here</Text>
						</Dropzone>
					</section>

					<section>
						{previews.length > 0 && (
							<div
								className={`mt-5 grid grid-cols-1 gap-4 py-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5`}>
								{previews}
							</div>
						)}
					</section>
				</div>
			</main>
		</BaseLayout>
	);
}
