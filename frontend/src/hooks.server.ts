import { auth } from '$lib/server/lucia';
import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.auth = auth.handleRequest(event);
	const { user } = await event.locals.auth.validateUser();
	event.locals.user = user;

	if (!event.route.id?.startsWith('/(auth)/') && !event.locals.user) throw redirect(302, '/login');
	if (event.route.id?.startsWith('/(auth)/') && event.locals.user) throw redirect(302, '/profile');
	return await resolve(event);
};
