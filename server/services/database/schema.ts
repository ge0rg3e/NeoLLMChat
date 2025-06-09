import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { v4 as uuid } from 'uuid';

export const users = sqliteTable('users', {
	id: text('id')
		.$defaultFn(() => uuid())
		.primaryKey(),
	username: text('username').notNull().unique(),
	email: text('email').notNull().unique(),
	password: text('password').notNull(),
	role: text('role').default('user'),
	permissions: text('permissions', { mode: 'json' })
		.$type<string[]>()
		.default(sql`'[]'`),
	refreshToken: text('refresh_token'),
	createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
	updatedAt: text('updated_at')
		.notNull()
		.default(sql`(CURRENT_TIMESTAMP)`)
		.$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
});

export const models = sqliteTable('models', {
	id: text('id')
		.$defaultFn(() => uuid())
		.primaryKey(),
	model: text('model').notNull(),
	provider: text('provider').notNull(),
	apiUrl: text('api_url').notNull(),
	apiKey: text('api_key').notNull(),
	createdBy: text('created_by').notNull(),
	createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`)
});

export const chats = sqliteTable('chats', {
	id: text('id')
		.$defaultFn(() => uuid())
		.primaryKey(),
	title: text('title').notNull(),
	createdBy: text('created_by').notNull(),
	createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
	updatedAt: text('updated_at')
		.notNull()
		.default(sql`(CURRENT_TIMESTAMP)`)
		.$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
});

export const messages = sqliteTable('messages', {
	id: text('id')
		.$defaultFn(() => uuid())
		.primaryKey(),
	chatId: text('chat_id').notNull(),
	role: text('role').$type<'user' | 'assistant'>().notNull(),
	content: text('content').notNull(),
	attachments: text('attachments', { mode: 'json' })
		.$type<string[]>()
		.default(sql`'[]'`),
	createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
	updatedAt: text('updated_at')
		.notNull()
		.default(sql`(CURRENT_TIMESTAMP)`)
		.$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
});
