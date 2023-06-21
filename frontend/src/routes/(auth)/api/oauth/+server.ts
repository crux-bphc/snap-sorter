import { googleAuth } from '$lib/server/lucia';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ cookies }) => {
	const [url, state] = await googleAuth.getAuthorizationUrl();

	cookies.set('google_oauth_state', state, {
		path: '/',
		maxAge: 60 * 60
	});

	return new Response(null, {
		status: 302,
		headers: {
			location: url.toString()
		}
	});
};
