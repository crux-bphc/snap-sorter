// Updates tags for a DopyImage
// Note: invalid tags in remove[] are silently ignored
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

		for (const tag of req.body.add) {
			const tagRecord = await prisma.tag.findUnique({ where: { id: tag } });
			if (!tagRecord) {
				return res.status(404).send(`Tag ${tag} not found`);
			}
		}

		await prisma.dopyImage.update({
			where: { id: req.body.image },
			data: {
				tags: {
					disconnect: req.body.remove.map((id) => ({ id })),
					connect: req.body.add.map((id) => ({ id })),
				},
			},
		});
		res.status(200).send("OK");
	} catch (e) {
		console.error(e);
		res.status(500).send("Internal Server Error");
	}
}
