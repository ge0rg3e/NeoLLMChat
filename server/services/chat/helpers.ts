import { decryptContent } from '../content-encryption';
import type { Message } from '~frontend/lib/types';
import { v4 as uuid } from 'uuid';
import db from '../database';
import OpenAI from 'openai';

export const sseEvent = (data: any) => `data: ${JSON.stringify(data)}\n\n`;

export const SYSTEM_PROMPT =
	'You are a helpful assistant responding in markdown with code blocks, lists, links (from web search), and clear formatting. Make sure to response in same language as user input.' as const;

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

export const saveMessages = async (chatId: string, messages: Message[], content: string, modelId: string) => {
	const updatedMessages = [...messages, { id: uuid(), role: 'assistant' as const, content, attachments: [], modelId }];
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

export const getModelThinkinParams = (provider: string) => {
	let params: any = {};

	if (provider === 'Gemini') {
		params = {
			extra_body: {
				google: {
					thinking_config: {
						include_thoughts: true
					}
				}
			}
		};
	}

	if (provider === 'Anthropic') {
		params = {
			thinking: { type: 'enabled', budget_tokens: 2000 }
		};
	}

	return params;
};

export const isCloudFlare502 = (input: string) => {
	if (input.startsWith('502 <!DOCTYPE html>\n<!--[if lt IE 7]>')) {
		return true;
	}

	return false;
};
