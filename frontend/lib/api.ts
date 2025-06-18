import type { App } from '~server/index';
import { treaty } from '@elysiajs/eden';

const treatyClient = treaty<App>(window.location.origin.endsWith(':8607') ? 'http://localhost:8608' : window.location.origin, {
	fetch: {
		credentials: 'include'
	}
});

export const parseChatChunk = (input: string) => {
	const cleanString = input.replace(/^data:\s?/, '');
	const parsedData = JSON.parse(cleanString);
	return {
		id: parsedData.id,
		role: parsedData.role,
		content: parsedData.content,
		done: parsedData.done
	} as {
		id: string;
		role: 'user' | 'assistant';
		content: string;
		done: boolean;
	};
};

const apiClient = treatyClient.api;
export default apiClient;
