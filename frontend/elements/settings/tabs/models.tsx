import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '~frontend/components/dialog';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '~frontend/components/chart';
import { InfoIcon, LockIcon, PlusIcon, RefreshCcwIcon, Trash2Icon } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, LabelList } from 'recharts';
import { Button } from '~frontend/components/button';
import { Tooltip } from '~frontend/components/tooltip';
import { Input } from '~frontend/components/input';
import { Label } from '~frontend/components/label';
import { useLiveQuery } from 'dexie-react-hooks';
import { useApp } from '~frontend/lib/context';
import { useEffect, useState } from 'react';
import apiClient from '~frontend/lib/api';
import db from '~frontend/lib/dexie';
import { toast } from 'sonner';

const List = () => {
	const { session } = useApp();
	const [dialogOpen, setDialogOpen] = useState(false);
	const models = useLiveQuery(() => db.models.toArray());

	const handleAddModel = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);
		const model = formData.get('model')?.toString();
		const provider = formData.get('provider')?.toString();
		const apiUrl = formData.get('apiUrl')?.toString();
		const apiKey = formData.get('apiKey')?.toString();

		if (!model || !provider || !apiUrl || !apiKey) return toast.error('Please fill in all required fields.');

		const { data, error } = await apiClient.models.post({ model, provider, apiUrl, apiKey });
		if (error) return toast.error(error?.value.toString());

		await db.models.put(data);

		setDialogOpen(false);
		toast.success('You have successfully added a new model.');
	};

	const handleDeleteModel = async (id: string) => {
		const yes = window.confirm('Are you sure you want to delete this model?');
		if (!yes) return;

		const { error } = await apiClient.models.delete({ id });
		if (error) return toast.error(error?.value.toString());

		await db.models.delete(id);
		toast.success('You have successfully deleted this model.');
	};

	return (
		<div className="space-y-2">
			<div className="flex-between-center">
				<h2 className="font-medium">Models</h2>

				{session?.role === 'admin' ? (
					<Dialog onOpenChange={setDialogOpen} open={dialogOpen}>
						<DialogTrigger>
							<Tooltip side="left" content="Add Model">
								<Button variant="ghost" size="icon">
									<PlusIcon className="size-4" />
								</Button>
							</Tooltip>
						</DialogTrigger>
						<DialogContent className="max-w-[450px] space-y-3 p-5">
							<DialogHeader>
								<DialogTitle>Add Model</DialogTitle>
							</DialogHeader>

							<form className="space-y-3.5 flex-col flex-center-center" onSubmit={handleAddModel}>
								<div className="w-full space-y-2">
									<Label htmlFor="model">Model</Label>
									<Input type="text" id="model" name="model" placeholder="e.g. gpt-3.5-turbo" required />
								</div>

								<div className="w-full space-y-2">
									<Label htmlFor="provider">Provider</Label>
									<Input name="provider" id="provider" type="text" placeholder="e.g. OpenAI" required />
								</div>

								<div className="w-full space-y-2">
									<Label htmlFor="apiUrl">ApiUrl</Label>
									<Input name="apiUrl" id="apiUrl" type="url" placeholder="e.g. https://api.openai.com/v1" required />
								</div>

								<div className="w-full space-y-2">
									<Label htmlFor="apiKey">
										ApiKey{' '}
										<Tooltip side="right" content="This API key will be stored encrypted in the database.">
											<LockIcon className="size-3 text-primary" />
										</Tooltip>
									</Label>
									<Input type="password" name="apiKey" id="apiKey" placeholder="e.g. sk-∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗" required />
								</div>

								<Button type="submit" className="w-full mt-3">
									Submit
								</Button>
							</form>
						</DialogContent>
					</Dialog>
				) : (
					<Tooltip side="left" content="Admin role required for managing models.">
						<InfoIcon className="size-4 text-muted-foreground" />
					</Tooltip>
				)}
			</div>

			{models?.map((model, index) => (
				<div key={index} className="w-full h-14 bg-accent/50 flex-between-center gap-x-2 text-sm px-3 border rounded-lg">
					<div className="flex flex-col items-start">
						<div>{model.model}</div>
						<div className="text-muted-foreground">{model.provider}</div>
					</div>

					<div className="flex-end-center gap-x-2">
						{session?.role === 'admin' && (
							<Button variant="ghost" size="icon" onClick={() => handleDeleteModel(model.id)}>
								<Trash2Icon className="size-4" />
							</Button>
						)}
					</div>
				</div>
			))}

			{models?.length === 0 && <p className="text-center text-sm text-muted-foreground">No models yet.</p>}
		</div>
	);
};

const Usage = () => {
	const models = useLiveQuery(() => db.models.count());

	const [data, setData] = useState<
		{
			id: string;
			model: string;
			messageCount: number;
		}[]
	>([]);

	const getData = async () => {
		const response = await apiClient.models.usage.get();
		if (response.data) setData(response.data);
	};

	useEffect(() => {
		getData();
	}, [models]);

	return (
		<div className="space-y-2">
			<div className="flex-between-center">
				<h2 className="font-medium">Usage</h2>

				<Tooltip side="left" content="Refresh">
					<Button variant="ghost" size="icon" onClick={async () => await getData()}>
						<RefreshCcwIcon className="size-4" />
					</Button>
				</Tooltip>
			</div>

			<ChartContainer
				className="bg-accent/50 rounded-lg"
				config={{
					messageCount: {
						label: 'Message Count',
						color: '#fff'
					}
				}}
			>
				<BarChart
					accessibilityLayer
					data={data}
					layout="vertical"
					margin={{
						top: 35,
						bottom: 35,
						right: 16,
						left: 14
					}}
				>
					<CartesianGrid horizontal={false} />

					<ChartTooltip cursor={{ fill: 'transparent', opacity: 0.1 }} content={<ChartTooltipContent indicator="line" labelFormatter={(_value, payload) => payload[0].payload.model} />} />
					<Bar dataKey="messageCount" layout="vertical" fill="#a995c95c" radius={4}>
						<LabelList dataKey="model" position="insideLeft" offset={12} fontSize={12} className="fill-foreground" />
					</Bar>
				</BarChart>
			</ChartContainer>
		</div>
	);
};

const ModelsTab = () => {
	return (
		<div className="size-full pl-3 space-y-5 animate-in fade-in overflow-y-auto pr-3">
			<List />
			<div className="w-full h-px bg-border my-5" />
			<Usage />
		</div>
	);
};

export default ModelsTab;
