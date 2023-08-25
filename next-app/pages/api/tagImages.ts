// Adds image tags in the database
// Pitfalls:
// The custom interface only keeps TS happy, it does not handle runtime errors that should return a 400
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions, prisma } from "./auth/[...nextauth]";

interface ExtendedNextApiRequest extends NextApiRequest {
	body: {
		tags: { image: string; users: string[] }[];
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
	if (session.user.role !== "admin") {
		return res.status(403).send("Forbidden");
	}

	// TODO: Add (actual) type guard for request body

	try {
		for (const { image, users } of req.body.tags) {
			const imageRecord = await prisma.dopyImage.findUnique({
				where: { filePath: image },
			});
			if (!imageRecord) {
				return res.status(404).send(`Image ${image} not found`);
			}

			for (const user of users) {
				const userRecord = await prisma.user.findUnique({
					where: { id: user },
				});
				if (!userRecord) {
					return res.status(404).send(`User ${user} not found`);
				}
				await prisma.dopyImage.update({
					where: { filePath: image },
					data: { taggedUsers: { connect: { id: user } } },
				});
			}
		}
		res.status(200).send("OK");
	} catch (e) {
		console.error(e);
		res.status(500).send("Internal Server Error");
	}
}
