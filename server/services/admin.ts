import { encrypt } from './data-encryption';
import { models } from './database/schema';
import authPlugin from './auth/plugin';
import Elysia, { t } from 'elysia';
import { v4 as uuid } from 'uuid';
import { db } from './database';
import { eq } from 'drizzle-orm';

const adminService = new Elysia({ prefix: '/api/admin' })
	.use(authPlugin)
	.get('/users', async ({ user }) => {
		if (user.role !== 'admin') return { error: 'Unauthorized' };

		const users = await db.query.users.findMany({ columns: { id: true, username: true, role: true } });
		return { data: users };
	})
	.post(
		'/models',
		async ({ body, user }) => {
			if (user.role !== 'admin') return { error: 'Unauthorized' };

			const ecryptedApiKey = (await encrypt(body.apiKey)) as string;

			const [newModel] = await db
				.insert(models)
				.values({
					id: uuid(),
					model: body.model,
					provider: body.provider,
					apiUrl: body.apiUrl,
					apiKey: ecryptedApiKey,
					createdBy: user.id
				})
				.returning();

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
	.patch(
		'/models',
		async ({ body, user }) => {
			if (user.role !== 'admin') return { error: 'Unauthorized' };

			let updatedData: any = {};

			if (body.apiKey) {
				updatedData['apiKey'] = (await encrypt(body.apiKey)) as string;
			}

			if (body.model) {
				updatedData['model'] = body.model;
			}

			if (body.provider) {
				updatedData['provider'] = body.provider;
			}

			if (body.apiUrl) {
				updatedData['apiUrl'] = body.apiUrl;
			}

			const [updatedModel] = await db
				.update(models)
				.set({ ...updatedData })
				.where(eq(models.id, body.id))
				.returning();

			return { data: updatedModel };
		},
		{
			body: t.Object({
				id: t.String(),
				model: t.Optional(t.String()),
				provider: t.Optional(t.String()),
				apiUrl: t.Optional(t.String()),
				apiKey: t.Optional(t.String())
			})
		}
	)
	.delete(
		'/models',
		async ({ body, user }) => {
			if (user.role !== 'admin') return { error: 'Unauthorized' };

			await db.delete(models).where(eq(models.id, body.id));
			return { data: true };
		},
		{
			body: t.Object({
				id: t.String()
			})
		}
	);

export default adminService;
