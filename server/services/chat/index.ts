import { getModel, getModelThinkinParams, getOrCreateChat, isCloudFlare502, saveMessages, sseEvent, SYSTEM_PROMPT } from './helpers';
import { formatWebResultForLLM, generateSearchQuery, SearchResult, webSearch } from './web-search';
import { chatPost, deleteChat, generateTitle } from './schema';
import type { Chat } from '~frontend/lib/types';
import authPlugin from '../auth/plugin';
import db from '../database';
import OpenAI from 'openai';
import Elysia from 'elysia';

const chatService = new Elysia({ prefix: '/api' })
	.use(authPlugin)
	.post(
		'/chat',
		async function* ({ body, request, user }) {
			const abortController = new AbortController();
			const abortSignal = request.signal;
			let isStreamClosed = false;
			const aiResponseChunks: string[] = [];

			const handleAbort = async () => {
				if (isStreamClosed) return;
				const content = aiResponseChunks.join('') + '\n\n**⛔ Stopped**';
				await saveMessages(body.chatId, body.messages, content, body.model.id);
				abortController.abort();
				isStreamClosed = true;
			};

			abortSignal.addEventListener('abort', handleAbort, { once: true });

			try {
				await getOrCreateChat(body.chatId, user.id);

				const model = await getModel(body.model.id);
				if (!model) throw new Error('Model not found');

				const formattedMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = body.messages.map((message) => ({
					id: message.id,
					role: message.role as any,
					content: [
						{ type: 'text', text: message.content },
						...message.attachments.map((attachment) => ({
							type: 'image_url' as const,
							image_url: {
								url: `data:${attachment.mimeType};base64,${attachment.data}`
							}
						}))
					]
				}));

				let params: any = {};
				let webSearchResults: SearchResult[] = [];

				if (body.model.params.thinkingMode) {
					params = { ...params, ...getModelThinkinParams(model.provider) };
				}

				if (body.model.params.webSearch) {
					const userMessage = body.messages[body.messages.length - 1];

					if (userMessage && userMessage.role === 'user') {
						const searchQuery = await generateSearchQuery(userMessage.content, model.instance, model.model);
						webSearchResults = await webSearch(searchQuery);
					}
				}

				const finalMessages = [{ role: 'system', content: [{ type: 'text', text: SYSTEM_PROMPT }, formatWebResultForLLM(webSearchResults)] }, ...formattedMessages];

				const aiResponse = await model.instance.chat.completions.create(
					{
						messages: finalMessages,
						model: model.model,
						stream: true,
						// @ts-ignore
						...params
					},
					{ signal: abortController.signal }
				);

				// @ts-ignore
				for await (const chunk of aiResponse) {
					if (abortSignal.aborted || isStreamClosed) break;

					const content = chunk.choices[0]?.delta.content ?? '';
					const done = chunk.choices[0]?.finish_reason === 'stop';

					if (content) aiResponseChunks.push(content);

					// Temporary fix - https://github.com/elysiajs/elysia/issues/742
					yield sseEvent({
						id: body.requestId,
						role: 'assistant',
						content,
						done
					});

					if (done) {
						await saveMessages(body.chatId, body.messages, aiResponseChunks.join(''), model.id);
						break;
					}
				}
			} catch (error: any) {
				let errorMessage = error.message || 'AI processing error';
				const isAbortError = error.name === 'AbortError';

				const isCloudFlare502Error = isCloudFlare502(errorMessage);
				if (isCloudFlare502Error) errorMessage = 'Cloudflare 502 error.';

				yield sseEvent({ id: body.requestId, role: 'assistant', content: isAbortError ? '\n\n**⛔ Stopped**' : `**⚠️ ${errorMessage}**`, done: true });
			} finally {
				isStreamClosed = true;
				abortSignal.removeEventListener('abort', handleAbort);
			}
		},
		{ body: chatPost }
	)
	.post(
		'/chat/generateTitle',
		async ({ body, status }) => {
			const chat = await db.chat.findUnique({ where: { id: body.chatId }, select: { title: true } });
			if (!chat) return status(404, 'Chat not found.');

			if (chat.title !== 'New chat') return status(400, 'Chat has a title.');

			const model = await getModel();
			if (!model) return status(400, 'Model not available.');

			const response = await model.instance.chat.completions.create({
				messages: [
					{
						role: 'user',
						content:
							'Generate a concise, descriptive title (max 6 words) that captures the main topic of this conversation. Return max 6 words. Respond with only the title, no additional text or punctuation. Prevent to return words like <think>.'
					},
					...body.messages.map((message) => ({
						role: message.role,
						content: message.content
					}))
				],
				model: model.model,
				stream: false
			});

			const title = response.choices[0]?.message?.content;
			if (!title) return status(500, 'Failed to generate title.');

			await db.chat.update({ where: { id: body.chatId }, data: { title } });

			return { title };
		},
		{ body: generateTitle }
	)
	.delete(
		'/chat',
		async ({ body, user, status }) => {
			try {
				await db.chat.deleteMany({ where: { id: body.id, createdBy: user.id } });
				return true;
			} catch {
				return status(500, 'Failed to delete chat.');
			}
		},
		{ body: deleteChat }
	)
	.get('/chats', async ({ user, status }) => {
		try {
			const chats = await db.chat.findMany({ where: { createdBy: user.id } });
			return chats as any as Chat[];
		} catch {
			return status(500, 'Failed to get chats.');
		}
	})
	.delete('/chats', async ({ user, status }) => {
		try {
			await db.chat.deleteMany({ where: { createdBy: user.id } });
			return true;
		} catch {
			return status(500, 'Failed to delete chats.');
		}
	});

export default chatService;
