import { staticPlugin } from '@elysiajs/static';
import authService from './services/auth';
import syncService from './services/sync';
import llmService from './services/llm';
import { cors } from '@elysiajs/cors';
import { Elysia } from 'elysia';
import { join } from 'path';

const app = new Elysia()
	.use(
		cors({
			origin: 'http://localhost:8607',
			methods: '*',
			credentials: true
		})
	)
	.use(llmService)
	.use(authService)
	.use(syncService)
	.use(
		staticPlugin({
			assets: join(process.cwd(), 'build/frontend'),
			prefix: '/'
		})
	)
	.listen(8608);

console.info(`⚡ NeoLLMChat is running at http://${app.server?.hostname}:${app.server?.port}`);

export type App = typeof app;
