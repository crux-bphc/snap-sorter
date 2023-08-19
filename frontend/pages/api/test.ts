import type { NextApiRequest, NextApiResponse } from "next";
import { promises } from "fs";
import { prisma } from "./auth/[...nextauth]";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		await prisma.event.create({
			data: { name: "atmos" },
		});
		const atmosRecord = await prisma.event.findFirst({
			where: { name: "atmos" },
		});
		const files = await promises.readdir("./dopy/");
		for (const file of files) {
			await prisma.dopyImage.create({
				data: {
					filePath: file,
					event: {
						connect: {
							id: atmosRecord?.id,
						},
					},
					taggedUsers: {
						connect: [
							{
								email: "f20210264@hyderabad.bits-pilani.ac.in",
							},
							{
								email: "f20220022@hyderabad.bits-pilani.ac.in",
							},
						],
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
