import OpenAI from 'openai';
import axios from 'axios';

export type SearchResult = {
	url: string;
	title: string;
	content: string;
	thumbnail: string;
	engine: string;
	template: string;
	parsed_url: string[];
	img_src: string;
	priority: string;
	engines: string[];
	positions: number[];
	score: number;
	category: string;
	publishedDate: any;
};

export const webSearch = async (query: string) => {
	try {
		const searchResponse = await axios.get(Bun.env.SEARXNG_HOST!, {
			params: {
				q: query,
				format: 'json',
				engines: Bun.env.SEARXNG_ENGINES ?? 'bing'
			}
		});

		return searchResponse.data.results.slice(0, 10) as SearchResult[];
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
