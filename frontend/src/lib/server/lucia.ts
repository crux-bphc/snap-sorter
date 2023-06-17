import { pg } from '@lucia-auth/adapter-postgresql';
import lucia from 'lucia-auth';
import { sveltekit } from 'lucia-auth/middleware';
import { google } from '@lucia-auth/oauth/providers';
import pkg from 'pg';
const { Pool } = pkg;
import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';

const pool = new Pool({
	connectionString: env.DATABASE_URL
});

export const auth = lucia({
	adapter: pg(pool),
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
