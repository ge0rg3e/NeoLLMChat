import { staticPlugin } from '@elysiajs/static';
import authService from './services/auth';
import chatService from './services/chat';
import { cors } from '@elysiajs/cors';
import { Elysia } from 'elysia';
import { join } from 'path';

const app = new Elysia()
	.use(
		cors({
			origin: 'http://localhost:8607',
			methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
			credentials: true
		})
	)
	.use(chatService)
	.use(authService)
	.use(
		staticPlugin({
			assets: join(process.cwd(), 'build/frontend'),
			prefix: '/'
		})
	)
	.listen(8608);

console.info(`⚡ NeoLLMChat is running at http://${app.server?.hostname}:${app.server?.port}`);

export type App = typeof app;
