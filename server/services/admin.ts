import { encryptContent } from './content-encryption';
import authPlugin from './auth/plugin';
import Elysia, { t } from 'elysia';
import db from './database';

const adminService = new Elysia({ prefix: '/api/admin' })
	.use(authPlugin)
	.post(
		'/models',
		async ({ body, user, set }) => {
			if (user.role !== 'admin') {
				set.status = 401;
				return { error: 'Admin role is required.' };
			}

			const ecryptedApiKey = await encryptContent(body.apiKey);

			const newModel = await db.model.create({
				data: {
					model: body.model,
					provider: body.provider,
					apiUrl: body.apiUrl,
					apiKey: ecryptedApiKey,
					createdBy: user.id
				}
			});

			return { data: newModel };
		},
		{
			body: t.Object({
				model: t.String(),
				provider: t.String(),
				apiUrl: t.String(),
				apiKey: t.String()
			})
		}
	)
	.delete(
		'/models',
		async ({ body, user, set }) => {
			if (user.role !== 'admin') {
				set.status = 401;
				return { error: 'Admin role is required.' };
			}

			await db.model.delete({
				where: {
					id: body.id
				}
			});
			return { data: true };
		},
		{
			body: t.Object({
				id: t.String()
			})
		}
	);

export default adminService;
