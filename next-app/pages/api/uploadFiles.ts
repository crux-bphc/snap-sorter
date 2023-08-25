// Handles the file upload API endpoint
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import formidable from "formidable";
import { authOptions, prisma } from "./auth/[...nextauth]";
import { mkdirSync } from "fs";

export const config = {
	api: {
		bodyParser: false,
	},
};

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

	let fileIds: string[] = [];

	// TODO: Add max file size
	const form = formidable({
		uploadDir: "./uploads/",
		// if not set, ext will always be empty in the filename function
		keepExtensions: true,
		filter: ({ name }) => {
			// TODO: Remove duplicate files
			return name === "files[]";
		},
		filename: (name, ext, part, form) => {
			const fileId = crypto.randomUUID();
			fileIds.push(fileId);
			return `${session.user.id}_${fileId}${ext}`;
		},
	});

	try {
		// formidable discards files if uploadDir does not exist
		mkdirSync(`./uploads/`, { recursive: true });
		await form.parse(req);

		for (const fileId of fileIds) {
			await prisma.image.create({
				data: {
					id: fileId,
					owner: {
						connect: { id: session.user.id },
					},
				},
			});
		}

		res.status(200).send("OK");
	} catch (e) {
		console.error(e);
		res.status(500).send("Internal Server Error");
	}
}
