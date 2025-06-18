import { getModel, getOrCreateChat, saveMessages, SYSTEM_PROMPT } from './helpers';
import type { Chat, Message } from '~frontend/lib/types';
import authPlugin from '../auth/plugin';
import { messages } from './schema';
import Elysia, { t } from 'elysia';
import db from '../database';
import OpenAI from 'openai';

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
				const content = aiResponseChunks.join('') + '\n\n**Stopped**';
				await saveMessages(body.chatId, body.messages, content);
				abortController.abort();
				isStreamClosed = true;
			};

			abortSignal.addEventListener('abort', handleAbort, { once: true });

			try {
				await getOrCreateChat(body.chatId, user.id);

				const model = await getModel(body.modelId);
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

				const aiResponse = await model.instance.chat.completions.create(
					{
						messages: [{ role: 'system', content: [{ type: 'text', text: SYSTEM_PROMPT }] }, ...formattedMessages],
						model: model.model,
						stream: true
					},
					{ signal: abortController.signal }
				);

				for await (const chunk of aiResponse) {
					if (abortSignal.aborted || isStreamClosed) break;

					const content = chunk.choices[0]?.delta.content ?? '';
					const done = chunk.choices[0]?.finish_reason === 'stop';

					if (content) aiResponseChunks.push(content);

					yield {
						id: body.requestId,
						role: 'assistant',
						content,
						done
					};

					if (done) {
						await saveMessages(body.chatId, body.messages, aiResponseChunks.join(''));
						break;
					}
				}
			} catch (error: any) {
				const isAbortError = error.name === 'AbortError';
				const errorMessage = isAbortError ? 'AI processing canceled' : error.message || 'AI processing error';
				yield { id: body.requestId, error: errorMessage };
			} finally {
				isStreamClosed = true;
				abortSignal.removeEventListener('abort', handleAbort);
			}
		},
		{
			body: t.Object({
				chatId: t.String(),
				requestId: t.String(),
				modelId: t.String(),
				messages: messages
			})
		}
	)
	.post(
		'/chat/generateTitle',
		async ({ body, set }) => {
			const chat = await db.chat.findUnique({ where: { id: body.chatId }, select: { title: true } });
			if (!chat) {
				set.status = 404;
				return { data: null, error: 'Chat not found' };
			}

			if (chat.title !== 'New chat') {
				set.status = 400;
				return { data: null, error: 'Chat has a title' };
			}

			const model = await getModel();
			if (!model) {
				set.status = 400;
				return { data: null, error: 'Model not available' };
			}

			const response = await model.instance.chat.completions.create({
				messages: [
					{ role: 'user', content: 'Generate a short title for this conversation. Make sure to return only the title.' },
					...body.messages.map((message) => ({
						role: message.role,
						content: message.content
					}))
				],
				model: model.model,
				stream: false
			});

			const title = response.choices[0]?.message?.content;
			if (!title) {
				set.status = 500;
				return { data: null, error: 'Failed to generate title' };
			}

			await db.chat.update({
				where: {
					id: body.chatId
				},
				data: {
					title
				}
			});

			return { data: { title }, error: null };
		},
		{
			body: t.Object({
				chatId: t.String(),
				messages: messages
			})
		}
	)
	.delete(
		'/chat',
		async ({ body, user, set }) => {
			try {
				await db.chat.deleteMany({
					where: {
						id: body.id,
						createdBy: user.id
					}
				});
				return { data: true };
			} catch {
				set.status = 500;
				return { error: 'Failed to delete chat.' };
			}
		},
		{
			body: t.Object({
				id: t.String()
			})
		}
	)
	.get('/chats', async ({ user }) => {
		return (await db.chat.findMany({
			where: {
				createdBy: user.id
			}
		})) as any as Chat;
	})
	.delete('/chats', async ({ user, set }) => {
		try {
			await db.chat.deleteMany({
				where: {
					createdBy: user.id
				}
			});
			return { data: true };
		} catch {
			set.status = 500;
			return { error: 'Failed to delete chats.' };
		}
	});

export default chatService;
