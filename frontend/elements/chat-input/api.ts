import apiClient, { parseResponseStream } from '~frontend/lib/api';
import type { Chat, Message } from '~frontend/stores/types';
import { useNavigate, useParams } from 'react-router';
import useStore from '~frontend/stores';
import { v4 as uuid } from 'uuid';

const useChatApi = () => {
	const navigate = useNavigate();
	const { id: chatId } = useParams();
	const { selectedModel, chats, chatInput, activeRequests, createChat, updateChatMessages, createRequest, deleteRequest } = useStore();

	const createNewChat = async () => {
		const newChatId = uuid();
		await createChat(newChatId);
		navigate(`/c/${newChatId}`);
		// Return the new chat object directly
		return { id: newChatId, messages: [] };
	};

	const sendMessage = async () => {
		const input = chatInput.trim();
		if (!input || !selectedModel) return;

		// Get or create chat
		let targetChatId: string;
		let chat = chatId ? chats.find((c) => c.id === chatId) : null;

		if (!chat) {
			chat = (await createNewChat()) as any as Chat;
			targetChatId = chat!.id;
		} else {
			targetChatId = chatId!;
		}

		// Add user message
		const requestId = uuid();
		const userMessage: Message = { id: requestId, role: 'user', content: input };
		const updatedMessages: Message[] = [...chat!.messages, userMessage];

		updateChatMessages(targetChatId, 'add', userMessage.id, userMessage);

		// Reset input
		useStore.setState({ chatInput: '' });

		// Send request to LLM
		const abortController = new AbortController();
		createRequest({ requestId, chatId: targetChatId, abortController });

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
		if (!chatId) return; // Guard against undefined chatId

		const activeRequest = activeRequests.find((r) => r.chatId === chatId);
		if (!activeRequest) return;

		activeRequest.abortController.abort();
		const chat = chats.find((c) => c.id === chatId);
		const lastMessage = chat?.messages[chat.messages.length - 1];

		if (lastMessage?.role === 'assistant') {
			const updatedContent = `${lastMessage.content}\n\n**Stopped**`;
			updateChatMessages(chatId, 'edit', lastMessage.id, { ...lastMessage, content: updatedContent });
		}

		deleteRequest(activeRequest.requestId);
	};

	const regenerateMessage = async (messageId: string) => {
		if (!chatId) return; // Guard against undefined chatId

		try {
			const chat = chats.find((c) => c.id === chatId);
			if (!chat || !selectedModel) return;

			const messageIndex = chat.messages.findIndex((m) => m.id === messageId);
			if (messageIndex === -1) return;

			// Keep messages up to the one we want to regenerate
			const messagesToKeep = chat.messages.slice(0, messageIndex);
			if (!messagesToKeep.length) return;

			// Update chat with truncated message history
			updateChatMessages(chatId, 'replace', '', { id: chatId, messages: messagesToKeep });

			// Create new request
			const requestId = uuid();
			const abortController = new AbortController();
			createRequest({ requestId, chatId, abortController });

			try {
				const response = await apiClient.chat.post(
					{
						chatId,
						requestId,
						modelId: selectedModel.id,
						messages: messagesToKeep
					},
					{ fetch: { signal: abortController.signal } }
				);

				if (!response.data) {
					deleteRequest(requestId);
					return;
				}

				// Process streaming response
				let assistantContent = '';
				const assistantMessageId = uuid();

				for await (const chunk of response.data as any) {
					const chunkData = parseResponseStream(chunk);
					if (!chunkData) continue;

					assistantContent += chunkData.content;
					updateChatMessages(chatId, 'edit', assistantMessageId, {
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
				console.error('>> NeoLLMChat - Failed to regenerate message.', err);
				deleteRequest(requestId);
			}
		} catch (err) {
			console.error('>> NeoLLMChat - Failed to regenerate message.', err);
		}
	};

	return {
		chatId,
		regenerateMessage,
		sendMessage,
		stopRequest
	};
};

export default useChatApi;
