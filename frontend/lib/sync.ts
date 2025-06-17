import { Sync } from 'elysiajs-sync/client';
import { config } from './sync-config';
import { useMemo } from 'react';

export const useSync = () => {
	const sync = useMemo(() => new Sync(config), []);
	const db = sync.getDb();
	return { sync, db };
};
