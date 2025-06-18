import { Toggle } from '~frontend/components/toggle';
import { useApp } from '~frontend/lib/context';
import { BrainIcon } from 'lucide-react';

const Thinking = () => {
	const { selectedModel, selectedModelParams, setSelectedModelParams } = useApp();

	if (!selectedModel || !selectedModel.details?.haveThinkingMode) return null;

	return (
		<Toggle
			value={selectedModelParams.thinkingMode === true ? 'true' : 'false'}
			onChange={(checked) => {
				setSelectedModelParams((prev) => ({
					...prev,
					thinkingMode: Boolean(checked)
				}));
			}}
			className="w-fit !h-[32px] shadow-none !bg-transparent !border-none !outline-none !ring-0 hover:!bg-primary/10 cursor-pointer"
		>
			<BrainIcon />
			Thinking
		</Toggle>
	);
};

export default Thinking;
