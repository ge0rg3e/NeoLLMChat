import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { ChevronsUpDownIcon } from 'lucide-react';
import { twMerge } from '~frontend/lib/utils';
import useStore from '~frontend/stores';

interface Props {
	orientation?: 'top' | 'bottom' | 'left' | 'right';
}

const ModelSelector = ({ orientation = 'bottom' }: Props) => {
	const { models, selectedModel } = useStore();

	const getOrientationClasses = () => {
		switch (orientation) {
			case 'top':
				return 'bottom-full mb-1';
			case 'left':
				return 'right-full mr-1';
			case 'right':
				return 'left-full ml-1';
			case 'bottom':
			default:
				return 'mt-1';
		}
	};

	return (
		<Listbox value={selectedModel} onChange={(model) => useStore.setState({ selectedModel: model })}>
			<div className="relative w-fit">
				<ListboxButton className="grid w-full grid-cols-1 rounded-lg py-2 px-3 flex-center-center gap-x-2 outline-none border-none transition-smooth hover:bg-accent/30 data-active:bg-accent/30 cursor-pointer">
					<span className="text-sm">{models.length ? selectedModel?.model ?? 'Select a model' : 'No models available'}</span>
					<ChevronsUpDownIcon className="text-muted-foreground size-3.5" />
				</ListboxButton>

				<ListboxOptions
					className={twMerge(
						'absolute z-10 w-full overflow-auto outline-none rounded-md bg-card py-1 shadow-sm border data-leave:transition data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0',
						getOrientationClasses()
					)}
					transition
				>
					{models.map((model) => (
						<ListboxOption
							className={twMerge(
								'group relative cursor-pointer py-2 px-3 flex-between-center transition-smooth data-focus:bg-primary/10',
								selectedModel?.id === model.id && 'bg-primary/10'
							)}
							value={model}
							key={model.id}
						>
							<span className="text-sm">{model.model}</span>
						</ListboxOption>
					))}
				</ListboxOptions>
			</div>
		</Listbox>
	);
};

export default ModelSelector;
