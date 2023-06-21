import { auth, googleAuth } from '$lib/server/lucia';
import { redirect, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ cookies, url, locals }) => {
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');
	const storedState = cookies.get('google_oauth_state');

	if (!code || !state || !storedState || state !== storedState) {
		throw Error('Invalid auth state');
	}

	const { existingUser, providerUser, createUser } = await googleAuth.validateCallback(code);

	let user;
	if (existingUser) {
		user = existingUser;
	} else if (providerUser.email?.endsWith('@hyderabad.bits-pilani.ac.in')) {
		user = await createUser({
			email: providerUser.email,
			name: providerUser.name
		});
	} else {
		console.error(`Invalid provider user email ${providerUser.email}`);
		throw redirect(302, '/login');
	}

	const session = await auth.createSession(user.userId);
	locals.auth.setSession(session);
	throw redirect(302, '/profile');
};
