import { decryptContent } from '../content-encryption';
import { chats, models } from '../database/schema';
import type { Message } from '~shared/types';
import { v4 as uuid } from 'uuid';
import { eq } from 'drizzle-orm';
import db from '../database';

export const SYSTEM_PROMPT = 'You are a helpful assistant responding in markdown with code blocks, lists, and clear formatting.' as const;

export const getOrCreateChat = async (chatId: string, userId: string) => {
	let chat = await db.query.chats.findFirst({ where: eq(chats.id, chatId) });
	if (!chat) {
		chat = (await db.insert(chats).values({ id: chatId, title: 'New chat', messages: [], createdBy: userId }).returning())[0];
	}
	return chat;
};

export const saveMessages = async (chatId: string, messages: Message[], content: string) => {
	const updatedMessages = [...messages, { id: uuid(), role: 'assistant' as const, content, attachments: [] }];
	try {
		await db.update(chats).set({ messages: updatedMessages }).where(eq(chats.id, chatId));
	} catch (error) {
		console.error('Error saving messages:', error);
	}
};

export const closeStream = (stream: any, isStreamClosed: boolean) => {
	if (isStreamClosed) return false;
	isStreamClosed = true;
	try {
		stream.close();
	} catch (error: any) {
		if (error.name !== 'TypeError' || !error.message.includes('Controller is already closed')) {
			console.error('Stream close error:', error.message);
		}
	}
	return true;
};

export const getModel = async (id: string) => {
	const model = await db.query.models.findFirst({ where: eq(models.id, id) });
	if (!model) return null;

	const decryptedApiKey = (await decryptContent(model.apiKey)) as string;
	return { id: model.id, model: model.model, provider: model.provider, apiUrl: model.apiUrl, decryptedApiKey };
};
