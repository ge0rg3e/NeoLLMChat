import { chats } from './database/schema';
import authPlugin from './auth/plugin';
import { eq } from 'drizzle-orm';
import { db } from './database';
import Elysia from 'elysia';

const syncService = new Elysia({ prefix: '/api/sync' }).use(authPlugin).get('/', async ({ user }) => {
	const userChats = await db.query.chats.findMany({ where: eq(chats.createdBy, user.id) });

	return { chats: userChats };
});

export default syncService;
