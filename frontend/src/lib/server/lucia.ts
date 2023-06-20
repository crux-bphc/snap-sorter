import lucia from 'lucia-auth';
import { sveltekit } from 'lucia-auth/middleware';
import { google } from '@lucia-auth/oauth/providers';
import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';
import prisma from '@lucia-auth/adapter-prisma';
import prismaClient from '$lib/prisma/client';

export const auth = lucia({
	adapter: prisma(prismaClient),
	env: dev ? 'DEV' : 'PROD',
	middleware: sveltekit(),
	transformDatabaseUser: (userData) => {
		return {
			userId: userData.id,
			email: userData.email,
			name: userData.name
		};
	}
});

export type Auth = typeof auth;

export const googleAuth = google(auth, {
	clientId: env.GOOGLE_CLIENT_ID || '',
	clientSecret: env.GOOGLE_CLIENT_SECRET || '',
	redirectUri: env.REDIRECT_URL || 'http://localhost:5173/api/oauth/google',
	scope: ['email']
});
