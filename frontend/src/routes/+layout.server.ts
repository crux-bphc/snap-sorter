import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, route }) => {
	const { user } = await locals.auth.validateUser();
	if (user || route.id === '/login') {
		return { user };
	} else {
		throw redirect(302, '/login');
	}
};
