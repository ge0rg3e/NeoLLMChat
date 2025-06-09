import type { Message as _Message } from '~frontend/stores/types';
import { CopyIcon, RefreshCcwIcon } from 'lucide-react';
import Button from '~frontend/components/button';
import { useEffect, useState } from 'react';
import useChatApi from '../chat-input/api';
import DOMPurify from 'dompurify';
import { marked } from 'marked';

type Props = {
	data: _Message;
};

const Message = ({ data }: Props) => {
	const { regenerateMessage } = useChatApi();
	const [sanitizedHtml, setSanitizedHtml] = useState<string>('');

	const scrollToLastMessage = () => {
		const chatMessages = document.getElementById('chat-messages');
		if (!chatMessages) return;
		chatMessages.scrollTop = chatMessages.scrollHeight;
	};

	const sanitizeHtml = async () => {
		const rawHtml = await marked.parse(data.content, {
			gfm: true,
			breaks: true
		});
		const cleanHtml = DOMPurify.sanitize(rawHtml);
		setSanitizedHtml(cleanHtml);
		scrollToLastMessage();
	};

	const handleRegenerate = async () => {
		await regenerateMessage(data.id);
	};

	const handleCopy = () => {
		navigator.clipboard.writeText(data.content);
	};

	useEffect(() => {
		sanitizeHtml();
	}, [data]);

	return (
		<div className="w-full max-w-[755px] mx-auto space-y-2">
			{data.role === 'user' ? <p className="bg-card rounded-xl py-2 px-3 w-fit">{data.content}</p> : <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />}

			{/* Options */}
			{data.role === 'assistant' && (
				<div className="flex-start-center gap-x-1 -mx-2">
					<Button variant="ghost" size="icon" title="Regenerate" onClick={handleRegenerate}>
						<RefreshCcwIcon />
					</Button>

					<Button variant="ghost" size="icon" title="Copy" onClick={handleCopy}>
						<CopyIcon />
					</Button>
				</div>
			)}
		</div>
	);
};

export default Message;
