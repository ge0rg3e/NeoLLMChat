import { Toggle } from '~frontend/components/toggle';
import { useApp } from '~frontend/lib/context';
import { GlobeIcon } from 'lucide-react';

const WebSearch = () => {
	const { selectedModel, selectedModelParams, setSelectedModelParams } = useApp();

	if (!selectedModel) return null;

	return (
		<Toggle
			pressed={selectedModelParams.webSearch}
			onPressedChange={(checked) => {
				setSelectedModelParams((prev) => ({
					...prev,
					webSearch: Boolean(checked)
				}));
			}}
			className="w-fit !h-[32px] shadow-none !bg-transparent !border-none !outline-none !ring-0 hover:!bg-primary/10 cursor-pointer"
		>
			<GlobeIcon />
			Web Search
		</Toggle>
	);
};

export default WebSearch;
