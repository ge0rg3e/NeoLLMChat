export type Theme = 'dark' | 'light';

export type ActiveRequest = {
	abortController: AbortController;
	requestId: string;
	chatId: string;
};

export type Session =
	| {
			id: string;
			username: string;
			role: 'admin' | 'user';
	  }
	| null
	| undefined;

export type Model = {
	id: string; // DB ID
	model: string;
	provider: string;
};

export type Chat = {
	id: string;
	title: string;
	messages: Array<Message>;
	createdBy: string;
	createdAt: Date;
};

export type Message = {
	id: string;
	role: 'user' | 'assistant';
	content: string;
};
