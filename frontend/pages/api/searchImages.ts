import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions, prisma } from "./auth/[...nextauth]";
import { DopyImage } from "@prisma/client";

interface ExtendedNextApiRequest extends NextApiRequest {
	body: {
		uid: string;
		events: string[];
	};
}

export default async function handler(
	req: ExtendedNextApiRequest,
	res: NextApiResponse
) {
	const session = await getServerSession(req, res, authOptions);

	if (req.method !== "POST") {
		return res.status(405).send(`Method ${req.method} Not Allowed`);
	}

	if (!session) {
		return res.status(401).send("Unauthorized");
	}

	// TODO: Handle req body here
	const { events, uid } = req.body;
	console.log(req.body);

	try {
		const userImages: DopyImage[][] = [];
		for (const event of events) {
			const images = await prisma.dopyImage.findMany({
				where: {
					eventId: event,
					taggedUsers: {
						some: {
							email: `${uid}@hyderabad.bits-pilani.ac.in`,
						},
					},
				},
			});
			userImages.push(images);
		}

		res.status(200).json({ userImages });
	} catch (e) {
		console.error(e);
		res.status(500).send("Internal Server Error");
	}
}
