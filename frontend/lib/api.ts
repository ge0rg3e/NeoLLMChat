import type { App } from '~server/index';
import { treaty } from '@elysiajs/eden';

const treatyClient = treaty<App>(import.meta.env.VITE_APP_DEV_API ?? window.location.origin, {
	fetch: {
		credentials: 'include'
	}
});

const apiClient = treatyClient.api;
export default apiClient;
