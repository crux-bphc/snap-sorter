// Updates tags for a DopyImage
// Note:
// - Invalid tags in remove[] are silently ignored
// - Tags in add[] are created if not found
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions, prisma } from "./auth/[...nextauth]";

interface ExtendedNextApiRequest extends NextApiRequest {
	body: {
		image: string;
		add: string[];
		remove: string[];
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
	// TODO: Restrict tag updates to certain users only

	try {
		const imageRecord = await prisma.dopyImage.findUnique({
			where: { id: req.body.image },
		});
		if (!imageRecord) {
			return res.status(404).send(`Image ${req.body.image} not found`);
		}

		const addIds = [];
		const removeIds = [];

		for (const tag of req.body.remove) {
			const tagRecord = await prisma.tag.findUnique({ where: { value: tag } });
			if (tagRecord) {
				removeIds.push(tagRecord.id);
			}
		}

		for (const tag of req.body.add) {
			const tagRecord = await prisma.tag.upsert({
				where: { value: tag },
				update: {},
				create: { value: tag },
			});
			addIds.push(tagRecord.id);
		}

		await prisma.dopyImage.update({
			where: { id: req.body.image },
			data: {
				tags: {
					disconnect: removeIds.map((id) => ({ id })),
					connect: addIds.map((id) => ({ id })),
				},
			},
		});
		res.status(200).send("OK");
	} catch (e) {
		console.error(e);
		res.status(500).send("Internal Server Error");
	}
}
