import { decryptContent } from '../content-encryption';
import type { Message } from '~frontend/lib/types';
import { v4 as uuid } from 'uuid';
import db from '../database';
import OpenAI from 'openai';

export const SYSTEM_PROMPT = 'You are a helpful assistant responding in markdown with code blocks, lists, and clear formatting.' as const;

export const getOrCreateChat = async (chatId: string, userId: string) => {
	let chat = await db.chat.findUnique({ where: { id: chatId } });
	if (!chat) {
		chat = await db.chat.create({
			data: {
				id: chatId,
				title: 'New chat',
				messages: [],
				createdBy: userId
			}
		});
	}
	return chat;
};

export const saveMessages = async (chatId: string, messages: Message[], content: string) => {
	const updatedMessages = [...messages, { id: uuid(), role: 'assistant' as const, content, attachments: [] }];
	try {
		await db.chat.update({ where: { id: chatId }, data: { messages: updatedMessages } });
	} catch (error) {
		console.error('Error saving messages:', error);
	}
};

export const getModel = async (id?: string) => {
	const model = id ? await db.model.findUnique({ where: { id } }) : await db.model.findFirst();
	if (!model) return null;

	const decryptedApiKey = (await decryptContent(model.apiKey)) as string;
	const instance = new OpenAI({ baseURL: model.apiUrl, apiKey: decryptedApiKey });

	return { id: model.id, model: model.model, provider: model.provider, apiUrl: model.apiUrl, decryptedApiKey, instance };
};
