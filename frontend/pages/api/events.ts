import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions, prisma } from "./auth/[...nextauth]";

interface ExtendedNextApiRequest extends NextApiRequest {
	query: {
		eventYear: string;
	};
}

export default async function handler(
	req: ExtendedNextApiRequest,
	res: NextApiResponse
) {
	const session = await getServerSession(req, res, authOptions);

	if (req.method !== "GET") {
		return res.status(405).send(`Method ${req.method} Not Allowed`);
	}

	if (!session || !session.user.id) {
		return res.status(401).send("Unauthorized");
	}

	try {
		// TODO: Handle req body
		const eventYear = new Date(req.query.eventYear).getFullYear();
		const availableEvents = await prisma.event.findMany({
			where: { year: eventYear },
		});

		// change the keys for the mantine multiselect format
		const formattedAvailableEvents = availableEvents.map((event) => ({
			value: event.id,
			label: event.name,
		}));
		res.status(200).json(formattedAvailableEvents);
	} catch (e) {
		console.error(e);
		res.status(500).send("Internal Server Error");
	}
}
