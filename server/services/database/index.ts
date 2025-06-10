import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

const db = drizzle({
	connection: {
		url: 'file:./data/neollmchat.db'
	},
	schema
});
export default db;
