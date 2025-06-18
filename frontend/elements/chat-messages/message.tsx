import { CheckIcon, CopyIcon, PencilIcon, RefreshCcwIcon, XIcon } from 'lucide-react';
import type { Message as _Message } from '~frontend/lib/types';
import { Fragment, useEffect, useState } from 'react';
import { Button } from '~frontend/components/button';
import { markedHighlight } from 'marked-highlight';
import { useLiveQuery } from 'dexie-react-hooks';
import useChatApi from '../chat-input/api';
import db from '~frontend/lib/dexie';
import * as cheerio from 'cheerio';
import { Marked } from 'marked';
import hljs from 'highlight.js';
import { Tooltip } from '~frontend/components/tooltip';

type Props = {
	data: _Message;
};

const Message = ({ data }: Props) => {
	const [isEditing, setIsEditing] = useState(false);
	const { chatId, regenerateMessage, editMessage } = useChatApi();
	const [editedContent, setEditedContent] = useState(data.content);
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

	const handleEditSave = async () => {
		if (editedContent.trim() === data.content) {
			setIsEditing(false);
			return;
		}

		await editMessage(data.id, editedContent);
		setIsEditing(false);
	};

	const handleEditCancel = () => {
		setEditedContent(data.content);
		setIsEditing(false);
	};

	const activeRequest = activeRequests?.find((r) => r.chatId === chatId);

	return (
		<div className="w-full max-w-[755px] mx-auto space-y-2 group">
			{data.role === 'user' && isEditing ? (
				<div className="bg-card rounded-xl py-2 px-3 w-fit">
					<textarea className="w-full size-fit bg-transparent resize-none outline-none" value={editedContent} onChange={(e) => setEditedContent(e.target.value)} />
				</div>
			) : data.role === 'user' ? (
				<p className="bg-accent/50 rounded-xl py-2 px-3 w-fit">{data.content}</p>
			) : (
				<div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: formattedContent }} />
			)}

			{/* Attachments  */}
			{data.attachments.length !== 0 && (
				<div className="flex-start-center gap-x-2 py-1">
					{data.attachments.map((attachment, index) => {
						const isImage = attachment.mimeType.startsWith('image/');

						return (
							<div key={index} className="flex-center-center overflow-hidden">
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
				<div className="flex-start-center gap-x-1 -mx-2 opacity-0 transition-smooth group-hover:opacity-100">
					{isEditing && (
						<Fragment>
							<Tooltip content="Save">
								<Button variant="ghost" size="icon" onClick={handleEditSave}>
									<CheckIcon />
								</Button>
							</Tooltip>

							<Tooltip content="Cancel">
								<Button variant="ghost" size="icon" title="Cancel" onClick={handleEditCancel}>
									<XIcon />
								</Button>
							</Tooltip>
						</Fragment>
					)}

					{data.role === 'assistant' && (
						<Fragment>
							<Tooltip content="Regenerate">
								<Button variant="ghost" size="icon" onClick={async () => await regenerateMessage(data.id)}>
									<RefreshCcwIcon />
								</Button>
							</Tooltip>
						</Fragment>
					)}

					{data.role === 'user' && !isEditing && (
						<Fragment>
							<Tooltip content="Edit">
								<Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
									<PencilIcon />
								</Button>
							</Tooltip>
						</Fragment>
					)}

					{!isEditing && (
						<Tooltip content="Copy">
							<Button variant="ghost" size="icon" onClick={() => navigator.clipboard.writeText(data.content)}>
								<CopyIcon />
							</Button>
						</Tooltip>
					)}
				</div>
			)}
		</div>
	);
};

export default Message;
