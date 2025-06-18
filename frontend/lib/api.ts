import type { App } from '~server/index';
import { treaty } from '@elysiajs/eden';

const treatyClient = treaty<App>(window.location.origin.endsWith(':8607') ? 'http://localhost:8608' : window.location.origin, {
	fetch: {
		credentials: 'include'
	}
});

const debug = localStorage.getItem('DEBUG') === 'true';

export const parseChatChunk = (input: string) => {
	if (debug) console.info('>> [DEBUG] NeoLLMChat - Input', input);

	const cleanString = input.trim().replace(/^data:\s?/, '');

	if (debug) console.info('>> [DEBUG] NeoLLMChat - Clean string', cleanString);

	try {
		const parsedData = JSON.parse(cleanString);

		if (debug) console.info('>> [DEBUG] NeoLLMChat - Parsed Data', parsedData);

		return {
			id: parsedData.id,
			role: parsedData.role as 'user' | 'assistant',
			content: parsedData.content,
			done: parsedData.done
		} as {
			id: string;
			role: 'user' | 'assistant';
			content: string;
			done: boolean;
		};
	} catch (err) {
		if (debug) console.info('>> [DEBUG] NeoLLMChat - Parsed Data Error', err);
		return null;
	}
};

const apiClient = treatyClient.api;
export default apiClient;
