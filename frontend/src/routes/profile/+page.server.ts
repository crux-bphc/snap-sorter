import { redirect, fail } from '@sveltejs/kit';
import { auth } from '$lib/server/lucia';
import type { PageServerLoad, Actions } from '../$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { user } = await locals.auth.validateUser();
	if (user && user.email.endsWith('@hyderabad.bits-pilani.ac.in')) {
		return { user };
	} else {
		throw redirect(302, '/login');
	}
};

export const actions: Actions = {
	logout: async ({ locals }) => {
		const session = await locals.auth.validate();
		if (!session) return fail(401);
		await auth.invalidateSession(session.sessionId);
		locals.auth.setSession(null);
	}
};
