import { sync, tSync as _tSync } from 'elysiajs-sync';
import { config } from '~frontend/lib/sync-config';
import frontendService from './services/frontend';
import adminService from './services/admin';
import authService from './services/auth';
import chatService from './services/chat';
import { cors } from '@elysiajs/cors';
import { Elysia, t } from 'elysia';

const tSync = _tSync(config);

const app = new Elysia()
	.use(
		cors({
			origin: 'http://localhost:8607',
			methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
			credentials: true
		})
	)
	.use(frontendService)
	.use(chatService)
	.use(adminService)
	.use(authService)
	.use(sync(config))
	.post(
		'/sync',
		({ sync, body }) => {
			// This is a placeholder. You'll need to implement your actual sync logic here.
			// For example, processing incoming changes from the client and returning server changes.
			console.log('Received sync request:', body);
			return sync({}, {}); // Return empty sync instructions for now
		},
		{
			body: t.Any(), // Define a more specific schema for your sync body
			response: {
				200: tSync(t.Any()) // Define a more specific schema for your sync response
			}
		}
	)
	.listen(8608);

console.info(`⚡ NeoLLMChat is running at http://${app.server?.hostname}:${app.server?.port}`);

export type App = typeof app;
