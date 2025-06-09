import { useLocation, useNavigate, useParams } from 'react-router';
import apiClient, { parseResponseStream } from '~frontend/lib/api';
import { SendHorizontalIcon, SquareIcon } from 'lucide-react';
import type { Message } from '~frontend/stores/types';
import dexieDb from '~frontend/stores/dexieDb';
import useStore from '~frontend/stores';
import { v4 as uuid } from 'uuid';

const ChatInput = () => {
	const params = useParams();
	const navigate = useNavigate();
	const location = useLocation();
	const { model, chats, chatInput, activeRequests, createChat, updateChatMessages, createRequest, deleteRequest } = useStore();

	const sendRequestToLLM = async () => {
		const input = chatInput.trim();
		if (!input) return;

		let chatId = params.id;

		// Create new chat if no ID provided
		if (!chatId) {
			chatId = uuid();

			createChat(chatId);
			await dexieDb.chats.add({ id: chatId, title: 'New Chat', messages: [] });

			navigate(`/c/${chatId}`);
		}

		// Verify chat exists
		const chat = chats.find((chat) => chat.id === chatId);
		if (!chat) return;

		// Add user message
		const requestId = uuid();
		const userMessage: Message = { id: requestId, role: 'user', content: input };
		const updatedMessages: Message[] = [...chat.messages, userMessage];

		updateChatMessages(chatId, 'add', userMessage.id, { ...userMessage });
		await dexieDb.chats.update(chatId, { messages: updatedMessages });

		// Call API
		const abortController = new AbortController();
		createRequest({ requestId: requestId, chatId, abortController, content: '' });

		const response = await apiClient.llm.chat.post({ requestId, model, messages: updatedMessages }, { fetch: { signal: abortController.signal } });
		if (!response.data) return;

		// Reset chatInput
		useStore.setState({ chatInput: '' });

		// Process streaming response
		let assistantContent = '';

		const assistantMessageId = uuid();
		for await (const chunk of response.data as any) {
			const chunkData = parseResponseStream(chunk);
			if (!chunkData) continue;

			assistantContent += chunkData.content;

			updateChatMessages(chatId, 'edit', assistantMessageId, { id: assistantMessageId, role: 'assistant', content: assistantContent });

			if (chunkData.done) {
				deleteRequest(requestId);
				await dexieDb.chats.update(chatId, { messages: [...updatedMessages, { id: assistantMessageId, role: 'assistant', content: assistantContent }] });

				assistantContent = '';
			}
		}
	};

	const handleSend = async () => {
		const activeRequest = activeRequests.find((request) => request.chatId === params.id);
		if (activeRequest) {
			activeRequest.abortController.abort();

			const chat = chats.find((chat) => chat.id === params.id);
			const message = chat?.messages[chat.messages.length - 1];

			if (message && message.role === 'assistant') {
				updateChatMessages(activeRequest.chatId, 'edit', message.id, { ...message, content: message?.content + '\n\n**Stopped**' });
				await dexieDb.chats.update(activeRequest.chatId, { messages: [...chat?.messages, { id: message.id, role: message.role, content: message.content + '\n\n**Stopped**' }] });
			}

			deleteRequest(activeRequest.requestId);
			return;
		}

		await sendRequestToLLM();
	};

	const getButtonState = () => {
		const activeRequest = activeRequests.find((request) => request.chatId === params.id);
		if (activeRequest) return { disabled: false, icon: SquareIcon, label: 'Stop' };
		if (!chatInput.trim()) return { disabled: true, icon: SendHorizontalIcon, label: 'Send' };

		return { disabled: false, icon: SendHorizontalIcon, label: 'Send' };
	};

	const buttonState = getButtonState();

	return (
		<div className={`w-full flex-center-center ${location.pathname.includes('/c') ? 'fixed max-w-[calc(100vw-270px)] bottom-5 right-0' : ''}`}>
			<div className="size-full max-w-[765px] max-h-[150px] rounded-3xl bg-card/50 p-2 backdrop-blur-xl">
				<div className="size-full flex-between-center flex-col bg-card/70 rounded-2xl">
					<textarea
						className="size-full max-h-[85px] p-3 !pb-0 bg-transparent outline-none border-none resize-none text-foreground placeholder:text-muted-foreground rounded-xl"
						onChange={(e) => useStore.setState({ chatInput: e.target.value })}
						placeholder="Type your prompt here..."
						onKeyDown={(e) => {
							if (e.key === 'Enter' && !e.shiftKey) {
								e.preventDefault();
								handleSend();
							}
						}}
						value={chatInput}
					/>
					<div className="w-full flex-between-center px-3 py-2">
						<div className="flex-start-center">{model.id}</div>
						<div className="flex-end-center">
							<button
								className="size-8 flex-center-center bg-primary hover:bg-primary/80 transition-smooth rounded-lg cursor-pointer disabled:opacity-80 disabled:cursor-default"
								disabled={buttonState.disabled}
								title={buttonState.label}
								onClick={handleSend}
							>
								<buttonState.icon className="size-4 text-card" />
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ChatInput;
