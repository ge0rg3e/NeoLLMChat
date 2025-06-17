import { PencilIcon, PlusIcon, Trash2Icon, XIcon } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import Button from '~frontend/components/button';
import Modal from '~frontend/components/modal';
import Input from '~frontend/components/input';
import { Fragment, useState } from 'react';
import apiClient from '~frontend/lib/api';
import db from '~frontend/lib/dexie';
import { toast } from 'sonner';

const Models = () => {
	const models = useLiveQuery(() => db.models.toArray());
	const [showModal, setShowModal] = useState<{ mode: 'add' | 'edit'; payload?: any } | null>(null);

	const handleAddModel = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const form = e.currentTarget as HTMLFormElement;
		const model = form.model.value;
		const provider = form.provider.value;
		const apiUrl = form.apiUrl.value;
		const apiKey = form.apiKey.value;

		const { data, error } = await apiClient.admin.models.post({ model, provider, apiUrl, apiKey });
		if (error) return toast.error((error.value as any).error);

		setShowModal(null);
		await db.models.put(data.data!);
		toast.success('You have successfully added a new model.');
	};

	const handleEditModel = async (e: React.FormEvent<HTMLFormElement>) => {
		if (!showModal?.payload) return;
		e.preventDefault();

		const form = e.currentTarget as HTMLFormElement;
		const model = form.model.value;
		const provider = form.provider.value;
		const apiUrl = form.apiUrl.value;
		const apiKey = form.apiKey.value;

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

			<Modal clasName="max-w-[450px] space-y-3 p-5" open={showModal !== null} onOpenChange={(state) => state === false && setShowModal(null)}>
				<div className="flex-between-center">
					<h1 className="font-medium">
						{showModal?.mode === 'add' && 'Add Model'}
						{showModal?.mode === 'edit' && 'Edit Model'}
					</h1>
					<Button variant="ghost" size="sm" title="Close" onClick={() => setShowModal(null)}>
						<XIcon className="size-5" />
					</Button>
				</div>

				<form className="space-y-3.5 flex-col flex-center-center" onSubmit={showModal?.mode === 'add' ? handleAddModel : handleEditModel}>
					<Input type="text" name="model" placeholder="Model (e.g llama3.2)" defaultValue={showModal?.payload?.model} required={showModal?.mode === 'add'} />
					<Input type="text" name="provider" placeholder="Provider (e.g ollama)" defaultValue={showModal?.payload?.provider} required={showModal?.mode === 'add'} />
					<Input type="url" name="apiUrl" placeholder="ApiUrl (e.g http://localhost:11434/v1)" defaultValue={showModal?.payload?.apiUrl} required={showModal?.mode === 'add'} />
					<Input type="password" name="apiKey" placeholder="ApiKey (************************)" required={showModal?.mode === 'add'} />

					<Button type="submit" className="w-full mt-3">
						Submit
						{showModal?.mode === 'edit' && ' Changes'}
					</Button>
				</form>
			</Modal>
		</Fragment>
	);
};

export default Models;
