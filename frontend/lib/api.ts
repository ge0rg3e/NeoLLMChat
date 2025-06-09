import type { App } from '~server/index';
import { treaty } from '@elysiajs/eden';

const treatyClient = treaty<App>(import.meta.env.NODE_ENV === 'production' ? window.location.origin : 'http://localhost:8608', {
	fetch: {
		credentials: 'include'
	}
});
const apiClient = treatyClient.api;

export const parseResponseStream = (responseString: string) => {
	// Split the response into lines
	const lines: string[] = responseString.trim().split('\n');

	// Initialize the result object
	const result: any = {};

	// Process each line
	for (const line of lines) {
		const [key, value]: string[] = line.split(': ', 2);
		if (key === 'data') {
			// Parse the data value as JSON
			result[key] = JSON.parse(value);
		}
	}

	return result.data;
};

export default apiClient;
