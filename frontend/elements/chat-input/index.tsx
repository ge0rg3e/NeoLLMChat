import { useLocation, useNavigate, useParams } from 'react-router';
import apiClient, { parseResponseStream } from '~frontend/lib/api';
import { SendHorizontalIcon, SquareIcon } from 'lucide-react';
import type { Message } from '~frontend/stores/types';
import ModelSelector from '../model-selector';
import useStore from '~frontend/stores';
import { v4 as uuid } from 'uuid';
import { useMemo } from 'react';

const ChatInput = () => {
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const { id: chatId } = useParams();
	const { selectedModel, chats, chatInput, activeRequests, createChat, updateChatMessages, createRequest, deleteRequest } = useStore();

	const createNewChat = async () => {
		const newChatId = uuid();
		await createChat(newChatId);
		navigate(`/c/${newChatId}`);
		return newChatId;
	};

	const sendMessage = async () => {
		const input = chatInput.trim();
		if (!input || !selectedModel) return;

		// Get or create chat
		const targetChatId = chatId || (await createNewChat());
		const chat = chats.find((c) => c.id === targetChatId);
		if (!chat) return;

		// Add user message
		const requestId = uuid();
		const userMessage: Message = { id: requestId, role: 'user', content: input };
		const updatedMessages: Message[] = [...chat.messages, userMessage];

		updateChatMessages(targetChatId, 'add', userMessage.id, userMessage);

		// Reset input
		useStore.setState({ chatInput: '' });

		// Send request to LLM
		const abortController = new AbortController();
		createRequest({ requestId, chatId: targetChatId, abortController, content: '' });

		try {
			const response = await apiClient.chat.post({ chatId: targetChatId, requestId, modelId: selectedModel.id, messages: updatedMessages }, { fetch: { signal: abortController.signal } });
			if (!response.data) return;

			// Process streaming response
			let assistantContent = '';
			const assistantMessageId = uuid();

			for await (const chunk of response.data as any) {
				const chunkData = parseResponseStream(chunk);
				if (!chunkData) continue;

				assistantContent += chunkData.content;
				updateChatMessages(targetChatId, 'edit', assistantMessageId, {
					id: assistantMessageId,
					role: 'assistant',
					content: assistantContent
				});

				if (chunkData.done) {
					deleteRequest(requestId);
					break;
				}
			}
		} catch (err) {
			console.error('>> NeoLLMChat - Failed to send chat request.', err);
			deleteRequest(requestId);
		}
	};

	const stopRequest = async () => {
		const activeRequest = activeRequests.find((r) => r.chatId === chatId);
		if (!activeRequest) return;

		activeRequest.abortController.abort();
		const chat = chats.find((c) => c.id === chatId);
		const lastMessage = chat?.messages[chat.messages.length - 1];

		if (lastMessage?.role === 'assistant') {
			const updatedContent = `${lastMessage.content}\n\n**Stopped**`;
			updateChatMessages(chatId!, 'edit', lastMessage.id, { ...lastMessage, content: updatedContent });
		}

		deleteRequest(activeRequest.requestId);
	};

	const handleSend = () => (activeRequests.find((r) => r.chatId === chatId) ? stopRequest() : sendMessage());

	const buttonState = useMemo(() => {
		const activeRequest = activeRequests.find((r) => r.chatId === chatId);
		if (activeRequest) return { disabled: false, icon: SquareIcon, label: 'Stop' };
		if (!chatInput.trim()) return { disabled: true, icon: SendHorizontalIcon, label: 'Send' };
		return { disabled: false, icon: SendHorizontalIcon, label: 'Send' };
	}, [chatId, chatInput, activeRequests]);

	return (
		<div className={`w-full flex items-center justify-center ${pathname.includes('/c') ? 'fixed bottom-5 right-0 max-w-[calc(100vw-270px)]' : ''}`}>
			<div className="w-full max-w-[765px] max-h-[150px] p-2 rounded-3xl bg-card/50 backdrop-blur-xl">
				<div className="flex flex-col w-full h-full rounded-2xl bg-card/70">
					<textarea
						className="w-full h-full p-3 pb-0 bg-transparent border-none outline-none resize-none rounded-xl text-foreground placeholder:text-muted-foreground"
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
					<div className="flex items-center justify-between w-full p-2.5 py-2">
						<ModelSelector orientation={pathname.includes('/c') ? 'top' : 'bottom'} />
						<button
							className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary hover:bg-primary/80 transition-colors text-card disabled:bg-primary/60 disabled:cursor-not-allowed"
							disabled={buttonState.disabled}
							title={buttonState.label}
							onClick={handleSend}
						>
							<buttonState.icon className="w-4 h-4" />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ChatInput;
