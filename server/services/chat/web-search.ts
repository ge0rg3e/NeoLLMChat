import * as cheerio from 'cheerio';
import OpenAI from 'openai';
import axios from 'axios';

export type SearchResult = {
	url: string;
	title: string;
	content: string;
};

export const webSearch = async (query: string) => {
	try {
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

		return results.slice(0, 10);
	} catch {
		return [];
	}
};

export const formatWebResultForLLM = (results: SearchResult[]) => {
	const formattedResults = results.map((result) => {
		return `URL: ${result.url}\nTitle: ${result.title}\nContent: ${result.content}`;
	});

	return {
		type: 'text',
		text: `Web search results:\n${formattedResults.join('\n')}`
	};
};

export const generateSearchQuery = async (userMessage: string, modelInstance: OpenAI, modelName: string) => {
	if (!userMessage.trim()) {
		return 'general knowledge'; // Fallback for empty message
	}

	try {
		const response = await modelInstance.chat.completions.create({
			messages: [
				{
					role: 'system',
					content:
						'You are a query generator for a web search engine. Based on the user message, generate a concise search query (3-5 words) that captures the main topic or intent. Output only the query, no additional text or punctuation.'
				},
				{
					role: 'user',
					content: userMessage
				}
			],
			model: modelName,
			stream: false,
			max_tokens: 10,
			temperature: 0.3
		});

		const query = response.choices[0]?.message?.content?.trim() || '';
		return query || 'general knowledge'; // Fallback if query is empty
	} catch (error) {
		console.error('Error generating search query with LLM:', error);
		return 'general knowledge'; // Fallback on error
	}
};
