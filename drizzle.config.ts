import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	dialect: 'sqlite',
	schema: './server/services/database/schema.ts',
	dbCredentials: {
		url: 'file:./neollmchat.db'
	}
});
