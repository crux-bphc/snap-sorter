import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, route }) => {
	const { user } = await locals.auth.validateUser();
	if (route.id === '/login' || user?.email.endsWith('@hyderabad.bits-pilani.ac.in')) {
		return { user };
	} else {
		throw redirect(302, '/login');
	}
};
