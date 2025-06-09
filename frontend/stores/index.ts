import type { ActiveRequest, Chat, Message, Model, Session, Theme } from './types';
import apiClient from '~frontend/lib/api';
import { create } from 'zustand';

interface Store {
	// states
	activeRequests: Array<ActiveRequest>;
	selectedModel: Model | null;
	models: Array<Model>;
	chats: Array<Chat>;
	chatInput: string;
	session: Session;
	theme: Theme;

	// actions - other
	init: () => Promise<void>;

	// actions - request
	createRequest: (data: ActiveRequest) => void;
	deleteRequest: (requestId: string) => void;

	// actions - chat
	createChat: (chatId: string) => void;
	updateChat: (chatId: string, data: Partial<Chat>) => void;
	updateChatMessages: (chatId: string, action: 'add' | 'edit' | 'delete', messageId: string, data: Partial<Message>) => void;
	deleteChat: (chatId: string) => void;
}

const getSession = async () => {
	try {
		await apiClient.auth.refresh.post();
		const { data } = await apiClient.auth.me.get();
		return data;
	} catch {
		return null;
	}
};

const useStore = create<Store>()((set) => ({
	// states
	session: undefined,
	selectedModel: null,
	activeRequests: [],
	chatInput: '',
	theme: 'dark',
	models: [],
	chats: [],

	// actions - other
	init: async () => {
		try {
			const session = (await getSession()) as Session;
			const chats = await apiClient.chats.get();
			const models = await apiClient.models.get();
			const theme = (localStorage.getItem('theme') as Theme) ?? 'dark';

			set({ session, chats: chats.data as any as Chat[], theme, models: models.data!, selectedModel: models.data![0] ?? null });
		} catch (err) {
			console.error('>> NeoLLMChat - Failed initialize store data.', err);
		}
	},

	// actions - active requests
	createRequest: (data: ActiveRequest) =>
		set((state) => {
			return { activeRequests: [...state.activeRequests, data] };
		}),
	deleteRequest: (requestId: string) =>
		set((state) => {
			const newRequests = state.activeRequests.filter((request) => request.requestId !== requestId);
			return { activeRequests: newRequests };
		}),

	// actions - chat
	createChat: (chatId: string) =>
		set((state) => {
			return { chats: [...state.chats, { id: chatId, title: 'New Chat', messages: [], createdBy: state.session!.id!, createdAt: new Date() }] };
		}),
	updateChat: (chatId: string, data: Partial<Chat>) =>
		set((state) => {
			const chat = state.chats.find((chat) => chat.id === chatId);
			if (!chat) return state;

			const newChat = { ...chat, ...data };
			const newChats = state.chats.map((chat) => (chat.id === chatId ? newChat : chat));
			return { chats: newChats };
		}),
	updateChatMessages: (chatId: string, action: 'add' | 'edit' | 'delete', messageId: string, data: Partial<Message>) =>
		set((state) => {
			const chat = state.chats.find((chat) => chat.id === chatId);
			if (!chat) return state;

			const newChat = { ...chat };

			switch (action) {
				case 'add':
					newChat.messages = [...newChat.messages, { id: messageId, role: data.role || 'user', content: data.content || '', ...data }];
					break;
				case 'edit':
					const existingMessage = newChat.messages.find((message) => message.id === messageId);
					if (existingMessage) {
						newChat.messages = newChat.messages.map((message) => (message.id === messageId ? { ...message, ...data } : message));
					} else {
						newChat.messages = [...newChat.messages, { id: messageId, role: data.role || 'user', content: data.content || '', ...data }];
					}
					break;
				case 'delete':
					newChat.messages = newChat.messages.filter((message) => message.id !== messageId);
					break;
			}

			const newChats = state.chats.map((chat) => (chat.id === chatId ? newChat : chat));
			return { chats: newChats };
		}),
	deleteChat: (chatId: string) =>
		set((state) => {
			const newChats = state.chats.filter((chat) => chat.id !== chatId);
			return { chats: newChats };
		})
}));

export default useStore;
