import { fail } from '@sveltejs/kit';
import { auth } from '$lib/server/lucia';
import type { Actions, PageServerLoad } from '../$types';
import prismaClient from '$lib/prisma/client';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { dev } from '$app/environment';

export const load: PageServerLoad = async ({ locals }) => {
	return { user: locals.user };
};

export const actions: Actions = {
	logout: async ({ locals }) => {
		const session = await locals.auth.validate();
		if (!session) return fail(401);
		await auth.invalidateSession(session.sessionId);
		locals.auth.setSession(null);
	},

	upload: async ({ locals, request }) => {
		const data = await request.formData();
		const length = data.get('length')?.toString();
		const user = locals.user;

		if (!length || length === '0') {
			return fail(400, { error: 'Please select the images to upload' });
		}

		try {
			const __filename = fileURLToPath(import.meta.url);
			const __dirname = path.dirname(__filename);
			const directories = __dirname.split('/');
			const projectRoot = dev ? '.' : directories.slice(0, directories.indexOf('server')).join('/');

			fs.mkdirSync(`${projectRoot}/images/`, { recursive: true });

			for (let i = 0; i < parseInt(length); i++) {
				const file = data.get(i.toString());
				if (!(file instanceof Object)) throw 'Image is not Object';

				const fileId = crypto.randomUUID();
				await prismaClient.image.create({
					data: {
						id: fileId,
						ownerId: user.id,
						owner: {
							connect: { id: user.userId }
						}
					}
				});

				const buffer = Buffer.from(await file.arrayBuffer());
				const fileExtension = file.name.slice(file.name.lastIndexOf('.'));
				const filePath = `./images/${fileId}${fileExtension}`;
				fs.writeFileSync(filePath, buffer, 'base64');
			}

			return {
				message: 'Uploaded files successfully'
			};
		} catch (err) {
			console.error(err);
			return fail(500, { error: 'File upload failed' });
		}
	}
};
