import Dexie, { type Table } from 'dexie';
import type { Chat } from './types';

class DexieDb extends Dexie {
	chats!: Table<Chat>;

	constructor() {
		super('NeoLLMChat');
		this.version(1).stores({
			chats: 'id, title, messages'
		});
	}
}

const dexieDb = new DexieDb();
export default dexieDb;
