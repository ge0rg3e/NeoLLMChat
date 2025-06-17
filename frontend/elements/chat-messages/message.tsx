import { CopyIcon, PencilIcon, RefreshCcwIcon } from 'lucide-react';
import type { Message as _Message } from '~shared/types';
import { Fragment, useEffect, useState } from 'react';
import { markedHighlight } from 'marked-highlight';
import { useLiveQuery } from 'dexie-react-hooks';
import Button from '~frontend/components/button';
import { useSync } from '~frontend/lib/sync';
import useChatApi from '../chat-input/api';
import * as cheerio from 'cheerio';
import { Marked } from 'marked';
import hljs from 'highlight.js';

type Props = {
	data: _Message;
};

const Message = ({ data }: Props) => {
	const { db } = useSync();
	const { chatId, regenerateMessage } = useChatApi();
	const [formattedContent, setFormattedContent] = useState<string>('');
	const activeRequests = useLiveQuery(() => db.activeRequests.toArray());

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

	useEffect(() => {
		formatContent();
	}, [data]);

	const activeRequest = activeRequests?.find((r) => r.chatId === chatId);

	return (
		<div className="w-full max-w-[755px] mx-auto space-y-2">
			{data.role === 'user' ? <p className="bg-card rounded-xl py-2 px-3 w-fit">{data.content}</p> : <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: formattedContent }} />}

			{/* Attachments  */}
			{data.attachments.length !== 0 && (
				<div className="flex-start-center gap-x-2 py-1">
					{data.attachments.map((attachment, i) => {
						const isImage = attachment.mimeType.startsWith('image/');

						return (
							<div key={i} className="flex-center-center overflow-hidden">
								{isImage && (
									<img
										src={`data:${attachment.mimeType};base64,${attachment.data}`}
										className="size-11 rounded-lg object-cover border"
										title={attachment.fileName}
										alt={attachment.fileName}
									/>
								)}
							</div>
						);
					})}
				</div>
			)}

			{/* Options */}
			{!activeRequest && (
				<div className="flex-start-center gap-x-1 -mx-2">
					{data.role === 'assistant' && (
						<Fragment>
							<Button variant="ghost" size="icon" title="Regenerate" onClick={async () => await regenerateMessage(data.id)}>
								<RefreshCcwIcon />
							</Button>
						</Fragment>
					)}

					{data.role === 'user' && (
						<Fragment>
							<Button variant="ghost" size="icon" title="Edit">
								<PencilIcon />
							</Button>
						</Fragment>
					)}

					<Button variant="ghost" size="icon" title="Copy" onClick={() => navigator.clipboard.writeText(data.content)}>
						<CopyIcon />
					</Button>
				</div>
			)}
		</div>
	);
};

export default Message;
