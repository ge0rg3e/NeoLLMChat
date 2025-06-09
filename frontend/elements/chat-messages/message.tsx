import type { Message as _Message } from '~frontend/stores/types';
import { CopyIcon, RefreshCcwIcon } from 'lucide-react';
import { markedHighlight } from 'marked-highlight';
import Button from '~frontend/components/button';
import { useEffect, useState } from 'react';
import useChatApi from '../chat-input/api';
import useStore from '~frontend/stores';
import * as cheerio from 'cheerio';
import hljs from 'highlight.js';
import { Marked } from 'marked';

type Props = {
	data: _Message;
};

const Message = ({ data }: Props) => {
	const { chatId, regenerateMessage } = useChatApi();
	const activeRequests = useStore((state) => state.activeRequests);
	const [formattedContent, setFormattedContent] = useState<string>('');

	const scrollToLastMessage = () => {
		const chatMessages = document.getElementById('chat-messages');
		if (!chatMessages) return;
		chatMessages.scrollTop = chatMessages.scrollHeight;
	};

	const formatContent = async () => {
		const marked = new Marked(
			markedHighlight({
				highlight(code, lang) {
					const language = hljs.getLanguage(lang) ? lang : 'plaintext';
					return hljs.highlight(code, { language }).value;
				}
			}),
			{
				gfm: true,
				breaks: true,
				async: true
			}
		);

		// Parse Markdown to HTML
		const html = await marked.parse(data.content);

		// Load HTML into Cheerio
		const $ = cheerio.load(html);

		// Add Tailwind classes to specific elements
		$('h1').addClass('text-3xl font-bold mb-4');
		$('p').addClass('text-sm mb-4');
		$('ul').addClass('list-disc pl-5');
		$('li').addClass('mb-2');

		setFormattedContent($.html());

		scrollToLastMessage();
	};

	const handleRegenerate = async () => {
		await regenerateMessage(data.id);
	};

	const handleCopy = () => {
		navigator.clipboard.writeText(data.content);
	};

	useEffect(() => {
		formatContent();
	}, [data]);

	const activeRequest = activeRequests.find((r) => r.chatId === chatId);

	return (
		<div className="w-full max-w-[755px] mx-auto space-y-2">
			{data.role === 'user' ? <p className="bg-card rounded-xl py-2 px-3 w-fit">{data.content}</p> : <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: formattedContent }} />}

			{/* Options */}
			{data.role === 'assistant' && !activeRequest && (
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
