import type { _AbortController, Chat, ChatInput, Model, Session, Theme } from './types';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import apiClient from './api';
import db from './dexie';

type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

interface ContextData {
	abortControllers: _AbortController[];
	setAbortControllers: SetState<_AbortController[]>;

	chatInput: ChatInput;
	setChatInput: SetState<ChatInput>;

	selectedModel: Model;
	setSelectedModel: SetState<Model>;

	session: Session;
	setSession: SetState<Session>;

	theme: Theme;
	setTheme: (theme: Theme) => void;
}

const getSession = async () => {
	try {
		await apiClient.auth.refresh.post();
		const { data } = await apiClient.auth.me.get();
		return data as Session;
	} catch {
		return null;
	}
};

const AppContext = createContext<ContextData>({} as any);

export const useApp = () => {
	const context = useContext(AppContext);
	if (!context) {
		throw new Error('useAppContext must be used within AppContext');
	}
	return context;
};

const AppContextProvider = ({ children }: { children: ReactNode }) => {
	const [chatInput, setChatInput] = useState<ChatInput>({ text: '', attachments: [] });
	const [abortControllers, setAbortControllers] = useState<_AbortController[]>([]);
	const [selectedModel, setSelectedModel] = useState<Model>({} as any);
	const [session, setSession] = useState<Session>(undefined);
	const [theme, _setTheme] = useState<Theme>('dark');

	const onLoad = async () => {
		// Get session
		const session = await getSession();
		setSession(session);

		// Get theme
		const theme = (localStorage.getItem('theme') as Theme) ?? 'dark';
		setTheme(theme);

		// Request sync
		await requestSync();
	};

	const requestSync = async () => {
		const { data } = await apiClient.sync.get();
		if (!data) return;

		await Promise.all([db.chats.clear(), db.models.clear()]);
		await Promise.all([db.chats.bulkAdd(data.chats as Chat[]), db.models.bulkAdd(data.models as Model[])]);

		setSelectedModel(data.models[0] ?? null);
	};

	useEffect(() => {
		onLoad();
	}, []);

	const setTheme = (theme: Theme) => {
		_setTheme(theme);
		localStorage.setItem('theme', theme);
	};

	useEffect(() => {
		if (theme === 'dark') {
			document.documentElement.classList.remove('neollmchat-light');
			document.documentElement.classList.add('neollmchat-dark');
			document.documentElement.style.colorScheme = 'dark';
		} else {
			document.documentElement.classList.remove('neollmchat-dark');
			document.documentElement.classList.add('neollmchat-light');
			document.documentElement.style.colorScheme = 'light';
		}
	}, [theme]);

	return (
		<AppContext.Provider
			value={{
				abortControllers,
				setAbortControllers,
				chatInput,
				setChatInput,
				selectedModel,
				setSelectedModel,
				session,
				setSession,
				theme,
				setTheme
			}}
		>
			{children}
		</AppContext.Provider>
	);
};

export default AppContextProvider;
