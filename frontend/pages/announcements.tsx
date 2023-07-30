import BaseLayout from "@/components/layouts/BaseLayout";
import type { InferGetServerSidePropsType } from "next";
import { prisma } from "./api/auth/[...nextauth]";
import { Announcement } from "@prisma/client";

type AnnouncementStringified = Omit<Announcement, "createdAt"> & {
	createdAt: string;
};

export const getServerSideProps = async () => {
	const announcements = await prisma.announcement.findMany();
	return {
		props: { announcements: JSON.parse(JSON.stringify(announcements)) },
	};
};

export default function Announcements({
	announcements,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	if (announcements.length == 0) {
		return (
			<BaseLayout>
				<h2 className="text-center">No announcements to show</h2>
			</BaseLayout>
		);
	}

	return (
		<BaseLayout>
			<main className="grid grid-cols-1 p-5 gap-y-4 mx-auto">
				{announcements.map(
					({ id, title, description, createdAt }: AnnouncementStringified) => (
						<article
							key={id}
							className="border border-solid border-gray-300/75 rounded-md p-4 bg-gray-100 shadow-md">
							<div>
								<h3>{title}</h3>
								<p>{new Date(createdAt).toDateString()}</p>
							</div>
							<p>{description}</p>
						</article>
					)
				)}
			</main>
		</BaseLayout>
	);
}
