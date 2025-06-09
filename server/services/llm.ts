import { Stream } from '@elysiajs/stream';
import authPlugin from './auth/plugin';
import Elysia, { t } from 'elysia';
import OpenAI from 'openai';

const llmService = new Elysia({ prefix: '/api/llm' })
	.use(authPlugin)
	.post(
		'/chat',
		({ body, request }) =>
			new Stream(async (stream) => {
				let providerDetails = { baseURL: '', apiKey: '' };

				if (body.model.provider === 'ollama') {
					providerDetails = { baseURL: 'http://localhost:11434/v1', apiKey: 'ollama' };
				}

				const provider = new OpenAI({ ...providerDetails });

				// Create an AbortController for the AI request
				const abortController = new AbortController();
				let isStreamClosed = false; // Track stream state

				// Listen for client request cancellation
				const handleAbort = () => {
					abortController.abort(); // Cancel the AI request
					if (!isStreamClosed) {
						isStreamClosed = true;
						stream.close(); // Close stream only if not already closed
					}
				};
				request.signal.addEventListener('abort', handleAbort);

				try {
					const aiResponse = await provider.chat.completions.create(
						{
							messages: [{ role: 'system', content: 'You are a helpful assistant that responds in markdown format with code blocks, lists, and clear formatting.' }, ...body.messages],
							model: body.model.id,
							stream: true
						},
						{ signal: abortController.signal }
					);

					for await (const chunk of aiResponse) {
						if (isStreamClosed || request.signal.aborted) {
							break; // Exit loop if stream is closed or request is aborted
						}
						stream.send({
							id: body.requestId,
							role: 'assistant',
							content: chunk.choices[0].delta.content ?? '',
							done: chunk.choices[0].finish_reason === 'stop'
						});
					}

					if (!isStreamClosed) {
						isStreamClosed = true;
						stream.close();
					}
				} catch (error: any) {
					if (error instanceof Error && error.name === 'AbortError') {
						console.log('AI processing canceled due to client request cancellation');
					} else {
						console.error('Error in AI processing:', error);
						if (!isStreamClosed) {
							stream.send({ id: body.requestId, error: 'An error occurred during AI processing' });
						}
					}
					if (!isStreamClosed) {
						isStreamClosed = true;
						stream.close();
					}
				} finally {
					// Cleanup abort listener to prevent memory leaks
					request.signal.removeEventListener('abort', handleAbort);
				}
			}),
		{
			body: t.Object({
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
	.get('/models', () => []);

export default llmService;
