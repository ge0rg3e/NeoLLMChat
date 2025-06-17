import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Attachment, Model, Theme } from '~shared/types';
import apiClient from './api';

type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

export type Session =
	| {
			id: string;
			username: string;
			role: 'admin' | 'user';
	  }
	| null
	| undefined;

type ChatInput = {
	text: string;
	attachments: Array<Attachment>;
};

type _AbortController = {
	requestId: string;
	controller: AbortController;
};

interface ContextData {
	abortControllers: _AbortController[];
	setAbortControllers: SetState<_AbortController[]>;

	chatInput: ChatInput;
	setChatInput: SetState<ChatInput>;

	models: Model[];
	setModels: SetState<Model[]>;
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
	const [abortControllers, setAbortControllers] = useState<_AbortController[]>([]);
	const [chatInput, setChatInput] = useState<ChatInput>({
		text: '',
		attachments: []
	});
	const [models, setModels] = useState<Model[]>([]);
	const [selectedModel, setSelectedModel] = useState<Model>({} as any);
	const [session, setSession] = useState<Session>(undefined);
	const [theme, _setTheme] = useState<Theme>('dark');

	const onLoad = async () => {
		try {
			const session = await getSession();
			setSession(session);

			if (session) {
				const theme = (localStorage.getItem('theme') as Theme) ?? 'dark';
				setTheme(theme);

				const { data: models } = await apiClient.models.get();
				setModels(models ?? []);
				setSelectedModel(models![0] ?? null);
			}
		} catch {}
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
				models,
				setModels,
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
