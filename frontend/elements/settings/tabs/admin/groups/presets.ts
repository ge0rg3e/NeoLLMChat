const registeredPresets = [
	{ label: 'Custom', value: 'custom', model: '', provider: '', apiUrl: '' },
	{ label: 'Ollama', value: 'ollama', model: 'llama3.2', provider: 'Ollama', apiUrl: 'http://localhost:11434/v1', apiKey: 'ollama' },
	{ label: 'OpenRouter', value: 'openrouter', model: 'meta-llama/llama-3.2-3b-instruct:free', provider: 'OpenRouter', apiUrl: 'https://openrouter.ai/api/v1' },
	{ label: 'OpenAI', value: 'openai', model: 'gpt-4o', provider: 'OpenAi', apiUrl: 'https://api.openai.com/v1' },
	{ label: 'Anthropic', value: 'anthropic', model: 'claude-3-haiku-20240307', provider: 'Anthropic', apiUrl: 'https://api.anthropic.com/v1' }
];

export default registeredPresets;
