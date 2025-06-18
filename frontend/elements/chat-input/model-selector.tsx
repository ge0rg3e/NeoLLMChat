import { Popover, PopoverContent, PopoverTrigger } from '~frontend/components/popover';
import { BrainIcon, ChevronDownIcon } from 'lucide-react';
import { Tooltip } from '~frontend/components/tooltip';
import { Button } from '~frontend/components/button';
import { useLiveQuery } from 'dexie-react-hooks';
import { useApp } from '~frontend/lib/context';
import db from '~frontend/lib/dexie';
import { useState } from 'react';

const ModelSelector = () => {
	const [open, setOpen] = useState(false);
	const { selectedModel, changeModel } = useApp();
	const models = useLiveQuery(() => db.models.toArray());

	return (
		<Popover onOpenChange={setOpen} open={open}>
			<PopoverTrigger asChild>
				<Button variant="ghost" className="hover:!bg-primary/10">
					{/* @ts-ignore */}
					{models?.length > 0 ? selectedModel.model ?? 'No model selected' : 'No models yet'} <ChevronDownIcon />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="!w-full !min-w-[250px] !max-w-[250px] p-1">
				{models?.map((model, index) => (
					<div
						key={index}
						className="w-full h-8 px-3 flex-between-center cursor-pointer rounded-sm hover:bg-primary/10"
						onClick={() => {
							changeModel(model);
							setOpen(false);
						}}
					>
						<div className="text-sm">{model.model}</div>

						<div className="flex-end-center gap-x-2">
							{model.details?.haveThinkingMode && (
								<Tooltip content="Thinking Mode" side="top">
									<div className="bg-card size-4 flex-center-center rounded-md">
										<BrainIcon />
									</div>
								</Tooltip>
							)}
						</div>
					</div>
				))}
			</PopoverContent>
		</Popover>
	);
};

export default ModelSelector;
