export const modelsDetails = [
	{
		model: 'grok3',
		haveThinkingMode: true,
		supportAttachments: true,
		multimodal: true,
		maxContextLength: 128000,
		specialFeatures: ['deepsearch mode', 'real-time web access']
	},
	{
		model: 'grok2',
		haveThinkingMode: false,
		supportAttachments: true,
		multimodal: true,
		maxContextLength: 32000,
		specialFeatures: ['image analysis', 'text generation']
	},
	{
		model: 'claude3.5-sonnet',
		haveThinkingMode: false,
		supportAttachments: true,
		multimodal: true,
		maxContextLength: 200000,
		specialFeatures: ['code generation', 'document analysis']
	},
	{
		model: 'gpt-4o',
		haveThinkingMode: false,
		supportAttachments: true,
		multimodal: true,
		maxContextLength: 128000,
		specialFeatures: ['vision capabilities', 'advanced reasoning']
	},
	{
		model: 'ollama3.2',
		haveThinkingMode: false,
		supportAttachments: false,
		multimodal: false,
		maxContextLength: 8192,
		specialFeatures: ['local inference', 'lightweight model']
	},
	{
		model: 'llama3.1',
		haveThinkingMode: false,
		supportAttachments: false,
		multimodal: false,
		maxContextLength: 131072,
		specialFeatures: ['open-source', 'fine-tuning support']
	},
	{
		model: 'mistral-7b',
		haveThinkingMode: false,
		supportAttachments: false,
		multimodal: false,
		maxContextLength: 32768,
		specialFeatures: ['efficient inference', 'text completion']
	},
	{
		model: 'gemini-1.5',
		haveThinkingMode: false,
		supportAttachments: true,
		multimodal: true,
		maxContextLength: 1048576,
		specialFeatures: ['long context window', 'multimodal reasoning']
	},
	{
		model: 'mixtral-8x7b',
		haveThinkingMode: false,
		supportAttachments: false,
		multimodal: false,
		maxContextLength: 32768,
		specialFeatures: ['mixture of experts', 'high efficiency']
	},
	{
		model: 'falcon-40b',
		haveThinkingMode: false,
		supportAttachments: false,
		multimodal: false,
		maxContextLength: 2048,
		specialFeatures: ['open-source', 'text generation']
	},
	{
		model: 'phi-3',
		haveThinkingMode: false,
		supportAttachments: false,
		multimodal: false,
		maxContextLength: 128000,
		specialFeatures: ['small footprint', 'edge deployment']
	},
	{
		model: 'bert-uncased',
		haveThinkingMode: false,
		supportAttachments: false,
		multimodal: false,
		maxContextLength: 512,
		specialFeatures: ['nlp tasks', 'embedding generation']
	},
	{
		model: 'roberta-base',
		haveThinkingMode: false,
		supportAttachments: false,
		multimodal: false,
		maxContextLength: 512,
		specialFeatures: ['text classification', 'robust embeddings']
	},
	{
		model: 't5-11b',
		haveThinkingMode: false,
		supportAttachments: false,
		multimodal: false,
		maxContextLength: 512,
		specialFeatures: ['text-to-text', 'translation']
	},
	{
		model: 'xlnet-large',
		haveThinkingMode: false,
		supportAttachments: false,
		multimodal: false,
		maxContextLength: 512,
		specialFeatures: ['permutation-based', 'nlp tasks']
	},
	{
		model: 'distilbert-base',
		haveThinkingMode: false,
		supportAttachments: false,
		multimodal: false,
		maxContextLength: 512,
		specialFeatures: ['lightweight', 'fast inference']
	},
	{
		model: 'llama2-70b',
		haveThinkingMode: false,
		supportAttachments: false,
		multimodal: false,
		maxContextLength: 4096,
		specialFeatures: ['research model', 'text generation']
	},
	{
		model: 'codellama-34b',
		haveThinkingMode: false,
		supportAttachments: false,
		multimodal: false,
		maxContextLength: 16384,
		specialFeatures: ['code generation', 'autocompletion']
	},
	{
		model: 'starcoder-15b',
		haveThinkingMode: false,
		supportAttachments: false,
		multimodal: false,
		maxContextLength: 8192,
		specialFeatures: ['programming', 'code synthesis']
	},
	{
		model: 'bloom-176b',
		haveThinkingMode: false,
		supportAttachments: false,
		multimodal: false,
		maxContextLength: 2048,
		specialFeatures: ['multilingual', 'open-source']
	},
	{
		model: 'opt-66b',
		haveThinkingMode: false,
		supportAttachments: false,
		multimodal: false,
		maxContextLength: 2048,
		specialFeatures: ['efficient training', 'text generation']
	},
	{
		model: 'mpt-30b',
		haveThinkingMode: false,
		supportAttachments: false,
		multimodal: false,
		maxContextLength: 8192,
		specialFeatures: ['text completion', 'open-source']
	},
	{
		model: 'vicuna-13b',
		haveThinkingMode: false,
		supportAttachments: false,
		multimodal: false,
		maxContextLength: 2048,
		specialFeatures: ['chatbot', 'fine-tuned']
	},
	{
		model: 'alpaca-7b',
		haveThinkingMode: false,
		supportAttachments: false,
		multimodal: false,
		maxContextLength: 2048,
		specialFeatures: ['instruction-tuned', 'research']
	},
	{
		model: 'qwen-14b',
		haveThinkingMode: false,
		supportAttachments: false,
		multimodal: false,
		maxContextLength: 8192,
		specialFeatures: ['multilingual', 'text generation']
	},
	{
		model: 'chatglm-6b',
		haveThinkingMode: false,
		supportAttachments: false,
		multimodal: false,
		maxContextLength: 2048,
		specialFeatures: ['conversational', 'chinese support']
	},
	{
		model: 'baichuan-13b',
		haveThinkingMode: false,
		supportAttachments: false,
		multimodal: false,
		maxContextLength: 4096,
		specialFeatures: ['multilingual', 'fine-tuning']
	},
	{
		model: 'llava-13b',
		haveThinkingMode: false,
		supportAttachments: true,
		multimodal: true,
		maxContextLength: 4096,
		specialFeatures: ['vision-language', 'image understanding']
	},
	{
		model: 'clip-vit',
		haveThinkingMode: false,
		supportAttachments: true,
		multimodal: true,
		maxContextLength: 77,
		specialFeatures: ['image-text', 'embedding']
	},
	{
		model: 'dall-e3',
		haveThinkingMode: false,
		supportAttachments: true,
		multimodal: true,
		maxContextLength: 0,
		specialFeatures: ['image generation', 'creative']
	},
	{
		model: 'stable-diffusion2',
		haveThinkingMode: false,
		supportAttachments: true,
		multimodal: true,
		maxContextLength: 0,
		specialFeatures: ['text-to-image', 'open-source']
	},
	{
		model: 'whisper-large',
		haveThinkingMode: false,
		supportAttachments: true,
		multimodal: true,
		maxContextLength: 0,
		specialFeatures: ['speech-to-text', 'multilingual']
	},
	{
		model: 'bart-large',
		haveThinkingMode: false,
		supportAttachments: false,
		multimodal: false,
		maxContextLength: 1024,
		specialFeatures: ['summarization', 'translation']
	},
	{
		model: 'pegasus-xsum',
		haveThinkingMode: false,
		supportAttachments: false,
		multimodal: false,
		maxContextLength: 512,
		specialFeatures: ['summarization', 'news']
	},
	{
		model: 'electra-small',
		haveThinkingMode: false,
		supportAttachments: false,
		multimodal: false,
		maxContextLength: 512,
		specialFeatures: ['efficient nlp', 'classification']
	},
	{
		model: 'deberta-v3',
		haveThinkingMode: false,
		supportAttachments: false,
		multimodal: false,
		maxContextLength: 512,
		specialFeatures: ['text classification', 'robust']
	},
	{
		model: 'gpt-neo-2.7b',
		haveThinkingMode: false,
		supportAttachments: false,
		multimodal: false,
		maxContextLength: 2048,
		specialFeatures: ['open-source', 'text generation']
	},
	{
		model: 'gpt-j-6b',
		haveThinkingMode: false,
		supportAttachments: false,
		multimodal: false,
		maxContextLength: 2048,
		specialFeatures: ['open-source', 'research']
	},
	{
		model: 'xglm-7.5b',
		haveThinkingMode: false,
		supportAttachments: false,
		multimodal: false,
		maxContextLength: 2048,
		specialFeatures: ['multilingual', 'text generation']
	},
	{
		model: 'flan-t5-xl',
		haveThinkingMode: false,
		supportAttachments: false,
		multimodal: false,
		maxContextLength: 512,
		specialFeatures: ['instruction-tuned', 'text-to-text']
	},
	{
		model: 'ul2-20b',
		haveThinkingMode: false,
		supportAttachments: false,
		multimodal: false,
		maxContextLength: 512,
		specialFeatures: ['universal model', 'nlp tasks']
	},
	{
		model: 'cohere-embed',
		haveThinkingMode: false,
		supportAttachments: false,
		multimodal: false,
		maxContextLength: 512,
		specialFeatures: ['text embeddings', 'semantic search']
	},
	{
		model: 'sentence-t5',
		haveThinkingMode: false,
		supportAttachments: false,
		multimodal: false,
		maxContextLength: 512,
		specialFeatures: ['sentence embeddings', 'similarity']
	},
	{
		model: 'jamba-1.5',
		haveThinkingMode: false,
		supportAttachments: true,
		multimodal: true,
		maxContextLength: 256000,
		specialFeatures: ['long context', 'hybrid architecture']
	},
	{
		model: 'xai-neura1.0',
		haveThinkingMode: true,
		supportAttachments: true,
		multimodal: true,
		maxContextLength: 64000,
		specialFeatures: ['reasoning', 'data synthesis']
	},
	{
		model: 'zephyr-7b',
		haveThinkingMode: false,
		supportAttachments: false,
		multimodal: false,
		maxContextLength: 8192,
		specialFeatures: ['fine-tuned', 'conversational']
	},
	{
		model: 'orca-13b',
		haveThinkingMode: false,
		supportAttachments: false,
		multimodal: false,
		maxContextLength: 4096,
		specialFeatures: ['research', 'instruction-following']
	},
	{
		model: 'yi-34b',
		haveThinkingMode: false,
		supportAttachments: false,
		multimodal: false,
		maxContextLength: 4096,
		specialFeatures: ['multilingual', 'high performance']
	},
	{
		model: 'deepseek-67b',
		haveThinkingMode: false,
		supportAttachments: false,
		multimodal: false,
		maxContextLength: 32768,
		specialFeatures: ['code generation', 'math reasoning']
	},
	{
		model: 'gemma-2b',
		haveThinkingMode: false,
		supportAttachments: false,
		multimodal: false,
		maxContextLength: 8192,
		specialFeatures: ['lightweight', 'open-source']
	},
	{
		model: 'qwen2-72b',
		haveThinkingMode: false,
		supportAttachments: false,
		multimodal: false,
		maxContextLength: 128000,
		specialFeatures: ['multilingual', 'advanced reasoning']
	},
	{
		model: 'llama3.2-90b',
		haveThinkingMode: false,
		supportAttachments: true,
		multimodal: true,
		maxContextLength: 131072,
		specialFeatures: ['vision-language', 'fine-tuning']
	},
	{
		model: 'mixtral-8x22b',
		haveThinkingMode: false,
		supportAttachments: false,
		multimodal: false,
		maxContextLength: 65536,
		specialFeatures: ['mixture of experts', 'high capacity']
	},
	{
		model: 'phi-3.5',
		haveThinkingMode: false,
		supportAttachments: false,
		multimodal: false,
		maxContextLength: 128000,
		specialFeatures: ['edge deployment', 'efficient']
	},
	{
		model: 'grok1.5',
		haveThinkingMode: false,
		supportAttachments: true,
		multimodal: true,
		maxContextLength: 32000,
		specialFeatures: ['image analysis', 'reasoning']
	},
	{
		model: 'claude3-opus',
		haveThinkingMode: false,
		supportAttachments: true,
		multimodal: true,
		maxContextLength: 200000,
		specialFeatures: ['advanced reasoning', 'document processing']
	},
	{
		model: 'gpt-4-turbo',
		haveThinkingMode: false,
		supportAttachments: true,
		multimodal: true,
		maxContextLength: 128000,
		specialFeatures: ['fast inference', 'vision capabilities']
	},
	{
		model: 'ollama3.1',
		haveThinkingMode: false,
		supportAttachments: false,
		multimodal: false,
		maxContextLength: 8192,
		specialFeatures: ['local inference', 'compact model']
	},
	{
		model: 'mistral-8b',
		haveThinkingMode: false,
		supportAttachments: false,
		multimodal: false,
		maxContextLength: 32768,
		specialFeatures: ['text completion', 'efficient']
	},
	{
		model: 'gemini-1.0',
		haveThinkingMode: false,
		supportAttachments: true,
		multimodal: true,
		maxContextLength: 524288,
		specialFeatures: ['multimodal reasoning', 'long context']
	},
	{
		model: 'codex-12b',
		haveThinkingMode: false,
		supportAttachments: false,
		multimodal: false,
		maxContextLength: 4096,
		specialFeatures: ['code generation', 'programming']
	},
	{
		model: 'llava-34b',
		haveThinkingMode: false,
		supportAttachments: true,
		multimodal: true,
		maxContextLength: 4096,
		specialFeatures: ['vision-language', 'image processing']
	},
	{
		model: 'stable-diffusion3',
		haveThinkingMode: false,
		supportAttachments: true,
		multimodal: true,
		maxContextLength: 0,
		specialFeatures: ['text-to-image', 'high quality']
	},
	{
		model: 'whisper-tiny',
		haveThinkingMode: false,
		supportAttachments: true,
		multimodal: true,
		maxContextLength: 0,
		specialFeatures: ['speech recognition', 'lightweight']
	},
	{
		model: 't5-small',
		haveThinkingMode: false,
		supportAttachments: false,
		multimodal: false,
		maxContextLength: 512,
		specialFeatures: ['text-to-text', 'translation']
	},
	{
		model: 'bert-large',
		haveThinkingMode: false,
		supportAttachments: false,
		multimodal: false,
		maxContextLength: 512,
		specialFeatures: ['nlp tasks', 'embeddings']
	},
	{
		model: 'roberta-large',
		haveThinkingMode: false,
		supportAttachments: false,
		multimodal: false,
		maxContextLength: 512,
		specialFeatures: ['text classification', 'robust']
	},
	{
		model: 'xlnet-base',
		haveThinkingMode: false,
		supportAttachments: false,
		multimodal: false,
		maxContextLength: 512,
		specialFeatures: ['permutation-based', 'nlp']
	},
	{
		model: 'distilroberta',
		haveThinkingMode: false,
		supportAttachments: false,
		multimodal: false,
		maxContextLength: 512,
		specialFeatures: ['lightweight', 'fast inference']
	},
	{
		model: 'llama2-13b',
		haveThinkingMode: false,
		supportAttachments: false,
		multimodal: false,
		maxContextLength: 4096,
		specialFeatures: ['text generation', 'research']
	},
	{
		model: 'codellama-13b',
		haveThinkingMode: false,
		supportAttachments: false,
		multimodal: false,
		maxContextLength: 16384,
		specialFeatures: ['code completion', 'programming']
	},
	{
		model: 'starcoder-7b',
		haveThinkingMode: false,
		supportAttachments: false,
		multimodal: false,
		maxContextLength: 8192,
		specialFeatures: ['code synthesis', 'open-source']
	},
	{
		model: 'bloom-7b',
		haveThinkingMode: false,
		supportAttachments: false,
		multimodal: false,
		maxContextLength: 2048,
		specialFeatures: ['multilingual', 'text generation']
	},
	{
		model: 'opt-13b',
		haveThinkingMode: false,
		supportAttachments: false,
		multimodal: false,
		maxContextLength: 2048,
		specialFeatures: ['efficient training', 'research']
	},
	{
		model: 'mpt-7b',
		haveThinkingMode: false,
		supportAttachments: false,
		multimodal: false,
		maxContextLength: 8192,
		specialFeatures: ['text completion', 'open-source']
	},
	{
		model: 'vicuna-7b',
		haveThinkingMode: false,
		supportAttachments: false,
		multimodal: false,
		maxContextLength: 2048,
		specialFeatures: ['chatbot', 'fine-tuned']
	},
	{
		model: 'alpaca-13b',
		haveThinkingMode: false,
		supportAttachments: false,
		multimodal: false,
		maxContextLength: 2048,
		specialFeatures: ['instruction-tuned', 'research']
	},
	{
		model: 'qwen-7b',
		haveThinkingMode: false,
		supportAttachments: false,
		multimodal: false,
		maxContextLength: 8192,
		specialFeatures: ['multilingual', 'text generation']
	},
	{
		model: 'chatglm-13b',
		haveThinkingMode: false,
		supportAttachments: false,
		multimodal: false,
		maxContextLength: 2048,
		specialFeatures: ['conversational', 'chinese support']
	},
	{
		model: 'baichuan-7b',
		haveThinkingMode: false,
		supportAttachments: false,
		multimodal: false,
		maxContextLength: 4096,
		specialFeatures: ['multilingual', 'fine-tuning']
	},
	{
		model: 'llava-7b',
		haveThinkingMode: false,
		supportAttachments: true,
		multimodal: true,
		maxContextLength: 4096,
		specialFeatures: ['vision-language', 'image understanding']
	},
	{
		model: 'clip-vit-base',
		haveThinkingMode: false,
		supportAttachments: true,
		multimodal: true,
		maxContextLength: 77,
		specialFeatures: ['image-text', 'embedding']
	},
	{
		model: 'dall-e2',
		haveThinkingMode: false,
		supportAttachments: true,
		multimodal: true,
		maxContextLength: 0,
		specialFeatures: ['image generation', 'creative']
	},
	{
		model: 'stable-diffusion1.5',
		haveThinkingMode: false,
		supportAttachments: true,
		multimodal: true,
		maxContextLength: 0,
		specialFeatures: ['text-to-image', 'open-source']
	},
	{
		model: 'whisper-medium',
		haveThinkingMode: false,
		supportAttachments: true,
		multimodal: true,
		maxContextLength: 0,
		specialFeatures: ['speech-to-text', 'multilingual']
	},
	{
		model: 'bart-base',
		haveThinkingMode: false,
		supportAttachments: false,
		multimodal: false,
		maxContextLength: 1024,
		specialFeatures: ['summarization', 'translation']
	},
	{
		model: 'pegasus-large',
		haveThinkingMode: false,
		supportAttachments: false,
		multimodal: false,
		maxContextLength: 512,
		specialFeatures: ['summarization', 'news']
	},
	{
		model: 'electra-large',
		haveThinkingMode: false,
		supportAttachments: false,
		multimodal: false,
		maxContextLength: 512,
		specialFeatures: ['efficient nlp', 'classification']
	},
	{
		model: 'deberta-v2',
		haveThinkingMode: false,
		supportAttachments: false,
		multimodal: false,
		maxContextLength: 512,
		specialFeatures: ['text classification', 'robust']
	},
	{
		model: 'gpt-neo-1.3b',
		haveThinkingMode: false,
		supportAttachments: false,
		multimodal: false,
		maxContextLength: 2048,
		specialFeatures: ['open-source', 'text generation']
	},
	{
		model: 'gpt-j-13b',
		haveThinkingMode: false,
		supportAttachments: false,
		multimodal: false,
		maxContextLength: 2048,
		specialFeatures: ['open-source', 'research']
	},
	{
		model: 'xglm-4.5b',
		haveThinkingMode: false,
		supportAttachments: false,
		multimodal: false,
		maxContextLength: 2048,
		specialFeatures: ['multilingual', 'text generation']
	},
	{
		model: 'flan-t5-large',
		haveThinkingMode: false,
		supportAttachments: false,
		multimodal: false,
		maxContextLength: 512,
		specialFeatures: ['instruction-tuned', 'text-to-text']
	},
	{
		model: 'ul2-7b',
		haveThinkingMode: false,
		supportAttachments: false,
		multimodal: false,
		maxContextLength: 512,
		specialFeatures: ['universal model', 'nlp tasks']
	},
	{
		model: 'cohere-classify',
		haveThinkingMode: false,
		supportAttachments: false,
		multimodal: false,
		maxContextLength: 512,
		specialFeatures: ['text classification', 'semantic search']
	},
	{
		model: 'sentence-bert',
		haveThinkingMode: false,
		supportAttachments: false,
		multimodal: false,
		maxContextLength: 512,
		specialFeatures: ['sentence embeddings', 'similarity']
	},
	{
		model: 'jamba-1.0',
		haveThinkingMode: false,
		supportAttachments: true,
		multimodal: true,
		maxContextLength: 128000,
		specialFeatures: ['long context', 'hybrid architecture']
	},
	{
		model: 'xai-neura0.5',
		haveThinkingMode: true,
		supportAttachments: true,
		multimodal: true,
		maxContextLength: 32000,
		specialFeatures: ['reasoning', 'data synthesis']
	},
	{
		model: 'zephyr-3b',
		haveThinkingMode: false,
		supportAttachments: false,
		multimodal: false,
		maxContextLength: 4096,
		specialFeatures: ['fine-tuned', 'conversational']
	},
	{
		model: 'orca-7b',
		haveThinkingMode: false,
		supportAttachments: false,
		multimodal: false,
		maxContextLength: 2048,
		specialFeatures: ['research', 'instruction-following']
	},
	{
		model: 'yi-6b',
		haveThinkingMode: false,
		supportAttachments: false,
		multimodal: false,
		maxContextLength: 4096,
		specialFeatures: ['multilingual', 'high performance']
	},
	{
		model: 'deepseek-33b',
		haveThinkingMode: false,
		supportAttachments: false,
		multimodal: false,
		maxContextLength: 16384,
		specialFeatures: ['code generation', 'math reasoning']
	},
	{
		model: 'gemma-7b',
		haveThinkingMode: false,
		supportAttachments: false,
		multimodal: false,
		maxContextLength: 8192,
		specialFeatures: ['lightweight', 'open-source']
	},
	{
		model: 'llama3.2',
		haveThinkingMode: false,
		supportAttachments: false,
		multimodal: false,
		maxContextLength: 8192,
		specialFeatures: ['lightweight', 'open-source']
	}
];

export const getModelDetails = (model: string) => {
	const modelDetails = modelsDetails.find((item) => item.model === model);
	if (!modelDetails) return null;

	return {
		haveThinkingMode: modelDetails.haveThinkingMode,
		supportAttachments: modelDetails.supportAttachments,
		multimodal: modelDetails.multimodal,
		maxContextLength: modelDetails.maxContextLength,
		specialFeatures: modelDetails.specialFeatures
	};
};
