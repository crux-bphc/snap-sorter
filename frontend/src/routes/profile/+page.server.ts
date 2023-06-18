import { fail } from '@sveltejs/kit';
import { auth } from '$lib/server/lucia';
import type { Actions } from '../$types';

export const actions: Actions = {
	logout: async ({ locals }) => {
		const session = await locals.auth.validate();
		if (!session) return fail(401);
		await auth.invalidateSession(session.sessionId);
		locals.auth.setSession(null);
	}
};
