import { closeStream, getModel, getOrCreateChat, saveMessages, SYSTEM_PROMPT } from './helpers';
import type { Chat } from '~frontend/lib/types';
import { Stream } from '@elysiajs/stream';
import authPlugin from '../auth/plugin';
import Elysia, { t } from 'elysia';
import db from '../database';
import OpenAI from 'openai';

const chatService = new Elysia({ prefix: '/api' })
	.use(authPlugin)
	.post(
		'/chat',
		async ({ body, request, user }) => {
			return new Stream(async (stream) => {
				const abortController = new AbortController();
				let isStreamClosed = false;
				const aiResponseChunks: string[] = [];

				const handleAbort = async () => {
					if (isStreamClosed) return;
					const content = aiResponseChunks.join('') + '\n\n**Stopped**';
					await saveMessages(body.chatId, body.messages, content);
					abortController.abort();
					isStreamClosed = closeStream(stream, isStreamClosed);
				};

				const abortSignal = request.signal;
				abortSignal.addEventListener('abort', handleAbort, { once: true });

				try {
					// Fetch or create chat
					await getOrCreateChat(body.chatId, user.id);

					const model = await getModel(body.modelId);
					if (!model) {
						throw new Error('Model not found');
					}

					// Initialize AI provider
					const provider = new OpenAI({ baseURL: model.apiUrl, apiKey: model.decryptedApiKey });

					const formattedMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = body.messages.map((message) => {
						return {
							id: message.id,
							role: message.role,
							content: [
								{ type: 'text', text: message.content },
								...message.attachments.map((attachment) => ({
									type: 'image_url' as const,
									image_url: {
										url: `data:${attachment.mimeType};base64,${attachment.data}`
									}
								}))
							]
						} as OpenAI.Chat.Completions.ChatCompletionMessageParam;
					});

					// Stream AI response
					const aiResponse = await provider.chat.completions.create(
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

						stream.send({
							id: body.requestId,
							role: 'assistant',
							content,
							done
						});

						if (done) {
							await saveMessages(body.chatId, body.messages, aiResponseChunks.join(''));
							break;
						}
					}
				} catch (error: any) {
					const isAbortError = error.name === 'AbortError';
					const errorMessage = isAbortError ? 'AI processing canceled' : error.message || 'AI processing error';
					if (!isStreamClosed) {
						stream.send({ id: body.requestId, error: errorMessage });
					}
				} finally {
					isStreamClosed = closeStream(stream, isStreamClosed);
					abortSignal.removeEventListener('abort', handleAbort);
				}
			});
		},
		{
			body: t.Object({
				chatId: t.String(),
				requestId: t.String(),
				modelId: t.String(),
				messages: t.Array(
					t.Object({
						id: t.String(),
						role: t.Union([t.Literal('user'), t.Literal('assistant')]),
						content: t.String(),
						attachments: t.Array(
							t.Object({
								fileName: t.String(),
								mimeType: t.String(),
								data: t.String()
							})
						)
					})
				)
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
