import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { ChevronsUpDownIcon } from 'lucide-react';
import useStore from '~frontend/stores';

const ModelSelector = () => {
	const { models, selectedModel } = useStore();

	return (
		<Listbox value={selectedModel} onChange={(model) => useStore.setState({ selectedModel: model })}>
			<div className="relative w-fit">
				<ListboxButton className="grid w-full grid-cols-1 rounded-lg py-2 px-3 flex-center-center gap-x-2 outline-none border-none transition-smooth hover:bg-accent/30 data-active:bg-accent/30 cursor-pointer">
					<span className="text-sm">{selectedModel?.id}</span>
					<ChevronsUpDownIcon className="text-muted-foreground size-3.5" />
				</ListboxButton>

				<ListboxOptions
					className="absolute z-10 mt-1 w-full overflow-auto outline-none rounded-md bg-card py-1 shadow-sm border data-leave:transition data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0"
					transition
				>
					{models.map((model) => (
						<ListboxOption
							className={`group relative cursor-pointer py-2 px-3 flex-between-center transition-smooth data-focus:bg-primary/10 ${
								selectedModel?.id === model.id ? 'bg-primary/10' : ''
							}`}
							value={model}
							key={model.id}
						>
							<span className="text-sm">{model.id}</span>
						</ListboxOption>
					))}
				</ListboxOptions>
			</div>
		</Listbox>
	);
};

export default ModelSelector;
