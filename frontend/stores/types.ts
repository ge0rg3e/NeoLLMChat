export type ActiveRequest = {
	abortController: AbortController;
	requestId: string;
	chatId: string;
	content: string;
};

export type Session =
	| {
			id: string;
			username: string;
	  }
	| null
	| undefined;

export type Model = {
	id: string;
	provider: string;
	params: any;
};

export type Chat = {
	id: string;
	title: string;
	messages: Array<Message>;
};

export type Message = {
	id: string;
	role: 'user' | 'assistant';
	content: string;
};
