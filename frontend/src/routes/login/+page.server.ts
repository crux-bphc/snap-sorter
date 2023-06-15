import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { user, session } = await locals.auth.validateUser();
	if (session && user.email.endsWith('@hyderabad.bits-pilani.ac.in')) throw redirect(302, '/');
	return {};
};
