import type { NextApiRequest, NextApiResponse } from "next";
import { promises } from "fs";
import { prisma } from "./auth/[...nextauth]";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		await prisma.event.create({
			data: {
				name: "atmos",
				eventYear: {
					create: {
						year: 2023,
					},
				},
			},
		});

		await prisma.event.create({
			data: { name: "atmos", eventYear: { create: { year: 2022 } } },
		});

		await prisma.event.create({
			data: {
				name: "pearl",
				eventYear: {
					connectOrCreate: { create: { year: 2023 }, where: { year: 2023 } },
				},
			},
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
