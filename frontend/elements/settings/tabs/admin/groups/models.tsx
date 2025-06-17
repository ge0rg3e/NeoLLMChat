import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~frontend/components/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~frontend/components/dialog';
import { LockIcon, PencilIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import { Fragment, useEffect, useState } from 'react';
import { Button } from '~frontend/components/button';
import { Input } from '~frontend/components/input';
import { Label } from '~frontend/components/label';
import { useLiveQuery } from 'dexie-react-hooks';
import registeredPresets from './presets';
import apiClient from '~frontend/lib/api';
import db from '~frontend/lib/dexie';
import { toast } from 'sonner';

const Models = () => {
	const models = useLiveQuery(() => db.models.toArray());
	const [showModal, setShowModal] = useState<{ mode: 'add' | 'edit'; payload?: any } | null>(null);
	const [provider, setProvider] = useState('');
	const [apiUrl, setApiUrl] = useState('');
	const [apiKey, setApiKey] = useState('');
	const [model, setModel] = useState('');

	const handlePresetChange = (value: string) => {
		const preset = registeredPresets.find((preset) => preset.value === value);
		if (!preset) return;

		setModel(preset.model);
		setProvider(preset.provider);
		setApiUrl(preset.apiUrl);
		setApiKey(preset.apiKey ?? '');
	};

	useEffect(() => {
		if (showModal?.mode === 'edit' && showModal.payload) {
			setModel(showModal.payload.model);
			setProvider(showModal.payload.provider);
			setApiUrl(showModal.payload.apiUrl);
			setApiKey(showModal.payload.apiKey);
		} else {
			setModel('');
			setProvider('');
			setApiUrl('');
			setApiKey('');
		}
	}, [showModal]);

	const handleAddModel = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const { data, error } = await apiClient.admin.models.post({ model, provider, apiUrl, apiKey });
		if (error) return toast.error((error.value as any).error);

		setShowModal(null);
		await db.models.put(data.data!);
		toast.success('You have successfully added a new model.');
	};

	const handleEditModel = async (e: React.FormEvent<HTMLFormElement>) => {
		if (!showModal?.payload) return;
		e.preventDefault();

		const { data, error } = await apiClient.admin.models.patch({ id: showModal.payload?.id, model, provider, apiUrl, apiKey });
		if (error) return toast.error((error.value as any).error);

		setShowModal(null);
		await db.models.put(data.data!);
		toast.success('You have successfully updated this model.');
	};

	const handleDeleteModel = async (id: string) => {
		const yes = window.confirm('Are you sure you want to delete this model?');
		if (!yes) return;

		const { error } = await apiClient.admin.models.delete({ id });
		if (error) return toast.error((error.value as any).error);

		setShowModal(null);
		await db.models.delete(id);
		toast.success('You have successfully deleted this model.');
	};

	return (
		<Fragment>
			<div className="animate-in fade-in space-y-2">
				<div className="flex-between-center">
					<h2 className="font-medium">Models</h2>
					<Button variant="ghost" size="icon" title="Add Model" onClick={() => setShowModal({ mode: 'add' })}>
						<PlusIcon className="size-4" />
					</Button>
				</div>

				{models?.map((model) => (
					<div key={model.id} className="w-full h-14 bg-accent flex-between-center gap-x-2 text-sm px-3 rounded-lg">
						<div className="flex flex-col items-start">
							<div>{model.model}</div>
							<div className="text-muted-foreground">{model.provider}</div>
						</div>

						<div className="flex-end-center gap-x-2">
							<Button variant="ghost" size="icon" title="Edit" onClick={() => setShowModal({ mode: 'edit', payload: model })}>
								<PencilIcon className="size-4" />
							</Button>

							<Button variant="ghost" size="icon" onClick={() => handleDeleteModel(model.id)}>
								<Trash2Icon className="size-4" />
							</Button>
						</div>
					</div>
				))}
			</div>

			<Dialog open={showModal !== null} onOpenChange={(state) => state === false && setShowModal(null)}>
				<DialogContent className="max-w-[450px] space-y-3 p-5">
					<DialogHeader>
						<DialogTitle>
							{showModal?.mode === 'add' && 'Add Model'}
							{showModal?.mode === 'edit' && 'Edit Model'}
						</DialogTitle>
					</DialogHeader>

					<form className="space-y-3.5 flex-col flex-center-center" onSubmit={showModal?.mode === 'add' ? handleAddModel : handleEditModel}>
						<div className="w-full space-y-2">
							<Label htmlFor="preset">Preset</Label>
							<Select defaultValue="custom" onValueChange={handlePresetChange}>
								<SelectTrigger className="w-full">
									<SelectValue id="preset" placeholder="Select a preset" />
								</SelectTrigger>
								<SelectContent>
									{registeredPresets.map((preset) => (
										<SelectItem value={preset.value}>{preset.label}</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="w-full space-y-2">
							<Label htmlFor="model">Model</Label>
							<Input type="text" id="model" name="model" value={model} onChange={(e) => setModel(e.target.value)} required={showModal?.mode === 'add'} />
						</div>

						<div className="w-full space-y-2">
							<Label htmlFor="provider">Provider</Label>
							<Input onChange={(e) => setProvider(e.target.value)} required={showModal?.mode === 'add'} value={provider} name="provider" id="provider" type="text" />
						</div>

						<div className="w-full space-y-2">
							<Label htmlFor="apiUrl">ApiUrl</Label>
							<Input onChange={(e) => setApiUrl(e.target.value)} required={showModal?.mode === 'add'} value={apiUrl} name="apiUrl" type="url" />
						</div>

						<div className="w-full space-y-2">
							<Label htmlFor="apiKey">
								ApiKey{' '}
								<span title="This API key will be stored encrypted in the database">
									<LockIcon className="size-3 text-primary" />
								</span>
							</Label>
							<Input onChange={(e) => setApiKey(e.target.value)} required={showModal?.mode === 'add'} type="password" value={apiKey} name="apiKey" />
						</div>

						<Button type="submit" className="w-full mt-3">
							Submit
							{showModal?.mode === 'edit' && ' Changes'}
						</Button>
					</form>
				</DialogContent>
			</Dialog>
		</Fragment>
	);
};

export default Models;
