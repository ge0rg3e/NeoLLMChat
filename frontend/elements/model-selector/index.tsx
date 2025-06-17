import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~frontend/components/select';
import { useLiveQuery } from 'dexie-react-hooks';
import { useApp } from '~frontend/lib/context';
import db from '~frontend/lib/dexie';

const ModelSelector = () => {
	const { selectedModel, setSelectedModel } = useApp();
	const models = useLiveQuery(() => db.models.toArray());

	return (
		<Select value={JSON.stringify(selectedModel)} onValueChange={(model) => setSelectedModel(JSON.parse(model))}>
			<SelectTrigger className="w-fit !h-[32px] shadow-none !bg-transparent !border-none !outline-none !ring-0 hover:!bg-primary/10 cursor-pointer">
				<SelectValue placeholder={models?.length === 0 ? 'No models yet' : 'Select a model'} />
			</SelectTrigger>
			<SelectContent>
				{models?.map((model) => (
					<SelectItem key={model.id} value={JSON.stringify(model)}>
						{model.model}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};

export default ModelSelector;
