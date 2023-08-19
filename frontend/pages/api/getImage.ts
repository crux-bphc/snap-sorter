import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions, prisma } from "./auth/[...nextauth]";
import { readFileSync } from "fs";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const session = await getServerSession(req, res, authOptions);
	if (req.method !== "POST") {
		return res.status(405).send(`Method ${req.method} Not Allowed`);
	}
	if (!session || !session.user.id) {
		return res.status(401).send("Unauthorized");
	}

	const filePath = "./dopy/" + req.body.filePath;

	try {
		const imageBuffer = readFileSync(filePath);
		res.setHeader("Content-Type", "image/jpg");
		res.status(200).send(imageBuffer);
	} catch (e) {
		console.error(e);
		res.status(500).send("Internal Server Error");
	}
}
