import { staticPlugin } from '@elysiajs/static';
import adminService from './services/admin';
import authService from './services/auth';
import chatService from './services/chat';
import { cors } from '@elysiajs/cors';
import { Elysia } from 'elysia';
import { join } from 'path';

const isProd = process.env.NODE_ENV === 'production';
const frontendBuild = isProd ? join('/app', 'build/frontend') : join(process.cwd(), 'build/frontend');

const app = new Elysia()
	.use(
		cors({
			origin: isProd ? '*' : 'http://localhost:8607',
			methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
			credentials: true
		})
	)
	.use(
		staticPlugin({
			assets: frontendBuild,
			prefix: '/'
		})
	)
	.get('*', ({ set }) => {
		const indexHtml = Bun.file(frontendBuild + '/index.html');
		set.headers['Content-Type'] = 'text/html';
		return indexHtml;
	})
	.use(chatService)
	.use(adminService)
	.use(authService)
	.listen(8608);

console.info(`⚡ NeoLLMChat is running at http://${app.server?.hostname}:${app.server?.port}`);

export type App = typeof app;
