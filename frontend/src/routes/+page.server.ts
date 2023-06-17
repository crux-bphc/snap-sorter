import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { user } = await locals.auth.validateUser();
	if (user && user.email.endsWith('@hyderabad.bits-pilani.ac.in')) {
		throw redirect(302, '/profile');
	} else {
		throw redirect(302, '/login');
	}
};
