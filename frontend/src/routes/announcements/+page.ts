import type { PageLoad } from './$types';

type Announcement = {
	title: string;
	details: string;
};

export const load = (async () => {
	// TODO: Error handling
	// TODO: Uncomment when backend is done
	// const res = await fetch('');
	// const announcements = (await res.json()) as Announcement[];

	// Mock data
	const announcements: Announcement[] = [
		{
			title: 'Something important',
			details: 'Something important details'
		},
		{
			title: 'Something important 2',
			details:
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam sed felis nisi. Donec fermentum vehicula dignissim. Suspendisse libero sapien, porta.'
		}
	];

	return {
		announcements
	};
}) satisfies PageLoad;
