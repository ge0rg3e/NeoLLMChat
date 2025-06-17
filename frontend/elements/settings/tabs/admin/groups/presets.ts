const registeredPresets = [
	{ label: 'Custom', value: 'custom', model: '', provider: '', apiUrl: '' },
	{ label: 'Ollama', value: 'ollama', model: 'llama3.2', provider: 'Ollama', apiUrl: 'http://localhost:11434/v1', apiKey: 'ollama' },
	{ label: 'OpenAI', value: 'openai', model: 'gpt-4o', provider: 'OpenAi', apiUrl: 'https://api.openai.com/v1' },
	{ label: 'Anthropic', value: 'anthropic', model: 'claude-2', provider: 'Anthropic', apiUrl: 'https://api.anthropic.com/v1' },
	{ label: 'Google', value: 'google', model: 'gemini-pro', provider: 'Google', apiUrl: 'https://generativelanguage.googleapis.com/v1beta2/models/gemini-pro:generateContent' }
];

export default registeredPresets;
