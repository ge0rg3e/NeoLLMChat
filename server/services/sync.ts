import { getModelDetails } from '~server/definitions/modelsDetails';
import authPlugin from './auth/plugin';
import { Elysia } from 'elysia';
import db from './database';

const syncService = new Elysia({ prefix: '/api' }).use(authPlugin).get('/sync', async ({ user }) => {
	const models = await db.model.findMany({ select: { id: true, model: true, provider: true } });
	const chats = await db.chat.findMany({ where: { createdBy: user.id } });

	return {
		models: models.map((e) => ({ ...e, details: getModelDetails(e.model) })),
		chats
	};
});

export default syncService;
