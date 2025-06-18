import type { App } from '~server/index';
import { treaty } from '@elysiajs/eden';

const treatyClient = treaty<App>(import.meta.env.NODE_ENV === 'production' ? window.location.origin : 'http://localhost:8608', {
	fetch: {
		credentials: 'include'
	}
});

const apiClient = treatyClient.api;
export default apiClient;
