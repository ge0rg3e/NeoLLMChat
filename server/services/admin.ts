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
	.patch(
		'/models',
		async ({ body, user, set }) => {
			if (user.role !== 'admin') {
				set.status = 401;
				return { error: 'Admin role is required.' };
			}

			let updatedData: any = {};

			if (body.apiKey) {
				updatedData['apiKey'] = await encryptContent(body.apiKey);
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

			const updatedModel = await db.model.update({
				where: {
					id: body.id
				},
				data: updatedData
			});

			return { data: { ...updatedModel, id: body.id } };
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
