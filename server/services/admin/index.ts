import { getModelDetails } from '~server/definitions/modelsDetails';
import { encryptContent } from '../content-encryption';
import { createModel, deleteModel } from './schema';
import authPlugin from '../auth/plugin';
import Elysia, { t } from 'elysia';
import db from '../database';

const adminService = new Elysia({ prefix: '/api/admin' })
	.use(authPlugin)
	.post(
		'/models',
		async ({ body, user, status }) => {
			if (user.role !== 'admin') return status(401, 'Admin role is required.');

			const ecryptedApiKey = await encryptContent(body.apiKey);

			const newModel = await db.model.create({
				data: { model: body.model, provider: body.provider, apiUrl: body.apiUrl, apiKey: ecryptedApiKey, createdBy: user.id },
				select: { id: true, model: true, provider: true }
			});

			return { ...newModel, details: getModelDetails(newModel.model) };
		},
		{ body: createModel }
	)
	.delete(
		'/models',
		async ({ body, user, status }) => {
			if (user.role !== 'admin') return status(401, 'Admin role is required.');

			try {
				await db.model.delete({ where: { id: body.id } });
				return true;
			} catch {
				return status(500, 'Error deleting model.');
			}
		},
		{ body: deleteModel }
	);

export default adminService;
