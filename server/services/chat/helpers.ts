import { llmRequest, type LLMResponse } from './llm-api';
import { decryptContent } from '../content-encryption';
import type { Message } from '~frontend/lib/types';
import * as cheerio from 'cheerio';
import { v4 as uuid } from 'uuid';
import db from '../database';
import axios from 'axios';

export const sseEvent = (data: any) => `data: ${JSON.stringify(data)}\n\n`;

export const SYSTEM_PROMPT =
	'You are a helpful assistant responding in markdown with code blocks, lists, links (from web search), and clear formatting. Make sure to response in same language as user input.' as const;

export const getOrCreateChat = async (chatId: string, userId: string) => {
	let chat = await db.chat.findUnique({ where: { id: chatId } });
	if (!chat) {
		chat = await db.chat.create({
			data: {
				id: chatId,
				title: 'New chat',
				messages: [],
				createdBy: userId
			}
		});
	}
	return chat;
};

export const saveMessages = async (chatId: string, messages: Message[], content: string, modelId: string) => {
	const updatedMessages = [...messages, { id: uuid(), role: 'assistant' as const, content, attachments: [], modelId }];
	try {
		await db.chat.update({ where: { id: chatId }, data: { messages: updatedMessages } });
	} catch (error) {
		console.error('Error saving messages:', error);
	}
};

export const getModel = async (modelId: string) => {
	const model = await db.model.findUnique({ where: { id: modelId } });
	if (!model) return null;

	const decryptedApiKey = (await decryptContent(model.apiKey)) as string;
	return { id: model.id, model: model.model, provider: model.provider, apiUrl: model.apiUrl, decryptedApiKey };
};

export type SearchResult = {
	url: string;
	title: string;
	content: string;
};

export const webSearch = async (input: string, modelId: string) => {
	try {
		const { data, error } = await llmRequest({
			modelId,
			messages: [
				{
					role: 'system',
					content:
						'You are a query generator for a web search engine. Based on the user message, generate a concise search query (3-5 words) that captures the main topic or intent. Output only the query, no additional text or punctuation.'
				},
				{ role: 'user', content: input }
			],
			stream: false,
			abortController: new AbortController()
		});

		if (error) return [];

		const query = (data as LLMResponse).content;

		const searxngHost = process.env.SEARXNG_HOST!;
		const engines = process.env.SEARXNG_ENGINES || 'bing';
		const searchUrl = new URL(searxngHost);
		searchUrl.searchParams.append('q', query);
		searchUrl.searchParams.append('engines', engines);

		const response = await axios.get(searchUrl.toString(), {
			headers: {
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
			}
		});

		const html = response.data;
		const $ = cheerio.load(html);
		const results: SearchResult[] = [];

		$('.result').each((_, element) => {
			const titleElement = $(element).find('h3 a, .title a');
			const urlElement = $(element).find('a.url_wrapper, a[href]');
			const contentElement = $(element).find('p, .content, .description, .snippet');

			const title = titleElement.text().trim();
			let url = urlElement.attr('href') || '';
			const content = contentElement.text().trim();

			if (url && !url.startsWith('http')) {
				url = new URL(url, searxngHost).toString();
			}

			if (title && url && content) {
				results.push({
					url,
					title,
					content
				});
			}
		});

		const formattedResults = results.slice(0, 15).map((result) => {
			return `URL: ${result.url}\nTitle: ${result.title}\nContent: ${result.content}`;
		});

		return {
			type: 'text',
			text: `Web search results:\n${formattedResults.join('\n')}`
		};
	} catch {
		return null;
	}
};
