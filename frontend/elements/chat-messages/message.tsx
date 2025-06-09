import type { Message as _Message } from '~frontend/stores/types';
import { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import { marked } from 'marked';

type Props = {
	data: _Message;
};

const Message = ({ data }: Props) => {
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

	useEffect(() => {
		sanitizeHtml();
	}, [data]);

	return (
		<div className="w-full max-w-[755px] mx-auto">
			{data.role === 'user' ? <p className="bg-card rounded-xl py-2 px-3 w-fit">{data.content}</p> : <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />}
		</div>
	);
};

export default Message;
