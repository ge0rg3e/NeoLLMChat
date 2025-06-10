import { reactRouter } from 'elysia-react-router';
import adminService from './services/admin';
import authService from './services/auth';
import chatService from './services/chat';
import { cors } from '@elysiajs/cors';
import { Elysia } from 'elysia';

const app = new Elysia()
	.use(
		cors({
			origin: '*',
			methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
			credentials: true
		})
	)
	.use(await reactRouter())
	.use(chatService)
	.use(adminService)
	.use(authService)
	.listen(8608);

console.info(`⚡ NeoLLMChat is running at http://${app.server?.hostname}:${app.server?.port}`);

export type App = typeof app;
