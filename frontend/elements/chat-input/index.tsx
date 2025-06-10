import { AttachmentsPreview, AttachmentsTrigger } from './attachments';
import { SendHorizontalIcon, SquareIcon } from 'lucide-react';
import Button from '~frontend/components/button';
import ModelSelector from '../model-selector';
import { twMerge } from '~frontend/lib/utils';
import { useLocation } from 'react-router';
import useStore from '~frontend/stores';
import { useMemo } from 'react';
import useChatApi from './api';

const ChatInput = () => {
	const { pathname } = useLocation();
	const { chatInput, activeRequests } = useStore();
	const { chatId, sendMessage, stopRequest } = useChatApi();

	const handleSend = () => (activeRequests.find((r) => r.chatId === chatId) ? stopRequest() : sendMessage());

	const buttonState = useMemo(() => {
		const activeRequest = activeRequests.find((r) => r.chatId === chatId);
		if (activeRequest) return { disabled: false, icon: SquareIcon, label: 'Stop' };
		if (!chatInput.text.trim()) return { disabled: true, icon: SendHorizontalIcon, label: 'Send' };
		return { disabled: false, icon: SendHorizontalIcon, label: 'Send' };
	}, [chatId, chatInput, activeRequests]);

	return (
		<div className={twMerge('w-full flex items-center justify-center', pathname.includes('/c') && 'fixed bottom-5 right-0 max-w-[calc(100vw-270px)]')}>
			<div className="w-full max-w-[765px] max-h-[200px] p-2 rounded-3xl bg-card/50 backdrop-blur-xl">
				<div className="flex flex-col w-full h-full rounded-2xl bg-card/70">
					<AttachmentsPreview />
					<textarea
						className="w-full h-full p-3 pb-0 bg-transparent border-none outline-none resize-none rounded-xl text-foreground placeholder:text-muted-foreground"
						onChange={(e) => useStore.setState((prev) => ({ chatInput: { ...prev.chatInput, text: e.target.value } }))}
						placeholder="Type your prompt here..."
						onKeyDown={(e) => {
							if (e.key === 'Enter' && !e.shiftKey) {
								e.preventDefault();
								handleSend();
							}
						}}
						value={chatInput.text}
					/>
					<div className="flex items-center justify-between w-full p-2.5 py-2">
						<div className="flex-start-center gap-x-2">
							<AttachmentsTrigger />
							<ModelSelector orientation={pathname.includes('/c') ? 'top' : 'bottom'} />
						</div>

						<Button size="icon" disabled={buttonState.disabled} title={buttonState.label} onClick={handleSend}>
							<buttonState.icon className="w-4 h-4" />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ChatInput;
