// Reset and populate DB with test data
// Pitfalls:
// It does not handle the user auth tables
// Start from a fresh docker volume (or run `pnpm prisma migrate reset`)
// Then, login to the app once to create the user auth tables
// You can then call the endpoint (any number of times) to reset and repopulate the DB
import type { NextApiRequest, NextApiResponse } from "next";
import { promises } from "fs";
import { prisma } from "./auth/[...nextauth]";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		// Delete all records
		const tablenames = await prisma.$queryRaw<
			Array<{ tablename: string }>
		>`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

		const keep = [
			"_prisma_migrations",
			"accounts",
			"sessions",
			"users",
			"verificationtokens",
		];
		const tables = tablenames
			.map(({ tablename }) => tablename)
			.filter((name) => !keep.includes(name))
			.map((name) => `"public"."${name}"`)
			.join(", ");

		await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`);

		// Create test data
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

		// Don't think about these
		const tags = ["potato", "forest", "paste", "mint", "obsidian btw"];

		for (const file of files) {
			const randomTag = tags[Math.floor(Math.random() * tags.length)];
			await prisma.dopyImage.create({
				data: {
					filePath: file,
					event: {
						connect: {
							id: atmosRecord?.id,
						},
					},
					tags: {
						connectOrCreate: {
							create: { value: randomTag },
							where: { value: randomTag },
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
