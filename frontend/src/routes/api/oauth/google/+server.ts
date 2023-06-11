import { auth, googleAuth } from '$lib/server/lucia';
import { redirect } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies, url, locals }) => {
	const code = url.searchParams.get('code') || '';
	const state = url.searchParams.get('state');
	const storedState = cookies.get('google_oauth_state');

	if (!state || !storedState || state !== storedState) {
		throw new Response(null, { status: 401 });
	}

	try {
		const { existingUser, providerUser, createUser } = await googleAuth.validateCallback(code);

		const getUser = async () => {
			if (existingUser) return existingUser;
			if (!providerUser.email)
				throw Error(`Provider user email is invalid, email: ${providerUser.email}`);
			return await createUser({
				email: providerUser.email
			});
		};

		const user = await getUser();
		const session = await auth.createSession(user.userId);
		locals.auth.setSession(session);
	} catch (e) {
		console.error(e);
		return new Response(null, {
			status: 500
		});
	}

	throw redirect(302, '/');
};
