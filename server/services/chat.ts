import { Stream } from '@elysiajs/stream';
import { chats } from './database/schema';
import authPlugin from './auth/plugin';
import Elysia, { t } from 'elysia';
import { v4 as uuid } from 'uuid';
import { and, eq } from 'drizzle-orm';
import { db } from './database';
import OpenAI from 'openai';

const SYSTEM_PROMPT = 'You are a helpful assistant responding in markdown with code blocks, lists, and clear formatting.' as const;

const PROVIDER_CONFIG: Record<string, { baseURL: string; apiKey: string }> = {
	ollama: { baseURL: 'http://localhost:11434/v1', apiKey: 'ollama' }
} as const;

const createProvider = (providerName: string) => {
	const providerDetails = PROVIDER_CONFIG[providerName] || { baseURL: '', apiKey: '' };
	return new OpenAI(providerDetails);
};

const getOrCreateChat = async (chatId: string, userId: string) => {
	let chat = await db.query.chats.findFirst({ where: eq(chats.id, chatId) });
	if (!chat) {
		chat = (await db.insert(chats).values({ id: chatId, title: 'New chat', messages: [], createdBy: userId }).returning())[0];
	}
	return chat;
};

const saveMessages = async (chatId: string, messages: Array<{ id: string; role: 'user' | 'assistant'; content: string }>, newContent: string) => {
	const updatedMessages = [...messages, { id: uuid(), role: 'assistant' as const, content: newContent }];
	try {
		await db.update(chats).set({ messages: updatedMessages }).where(eq(chats.id, chatId));
	} catch (error) {
		console.error('Error saving messages:', error);
	}
};

const closeStream = (stream: any, isStreamClosed: boolean) => {
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

					// Initialize OpenAI provider
					const provider = createProvider(body.model.provider);

					// Stream AI response
					const aiResponse = await provider.chat.completions.create(
						{
							messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...body.messages],
							model: body.model.id,
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
				messages: t.Array(
					t.Object({
						id: t.String(),
						role: t.Union([t.Literal('user'), t.Literal('assistant')]),
						content: t.String()
					})
				),
				model: t.Object({
					id: t.String(),
					provider: t.String(),
					params: t.Any()
				})
			})
		}
	)
	.delete(
		'/chat',
		async ({ body, user }) => {
			await db.delete(chats).where(and(eq(chats.id, body.id), eq(chats.createdBy, user.id)));
			return { success: true };
		},
		{
			body: t.Object({
				id: t.String()
			})
		}
	)
	.get('/chats', async ({ user }) => {
		const userChats = await db.query.chats.findMany({ where: eq(chats.createdBy, user.id) });
		return userChats;
	})
	.delete('/chats', async ({ user }) => {
		await db.delete(chats).where(eq(chats.createdBy, user.id));
		return { success: true };
	});

export default chatService;
