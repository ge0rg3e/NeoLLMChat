import { encryptContent } from '../content-encryption';
import { createModel, deleteModel } from './schema';
import { Chat, Message } from '~frontend/lib/types';
import authPlugin from '../auth/plugin';
import db from '../database';
import Elysia from 'elysia';

const modelsService = new Elysia({ prefix: '/api' })
	.use(authPlugin)
	.get('/models/usage', async ({}) => {
		let messages: Message[] = [];
		const allModels = await db.model.findMany();
		const allChats = await db.chat.findMany();

		for await (const chat of allChats as Chat[]) {
			messages.push(...chat.messages);
		}

		messages = messages.filter((message) => message.role === 'assistant' && message.modelId !== undefined);

		const usage = allModels.map((model) => ({
			model: model.model,
			messageCount: messages.filter((message) => message.modelId === model.id).length
		}));

		return usage;
	})
	.post(
		'/models',
		async ({ body, user, status }) => {
			if (user.role !== 'admin') return status(401, 'Admin role is required.');

			const ecryptedApiKey = await encryptContent(body.apiKey);

			const newModel = await db.model.create({
				data: { model: body.model, provider: body.provider, apiUrl: body.apiUrl, apiKey: ecryptedApiKey, createdBy: user.id },
				select: { id: true, model: true, provider: true }
			});

			return newModel;
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

export default modelsService;
