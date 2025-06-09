import { PencilIcon, PlusIcon, Trash2Icon, XIcon } from 'lucide-react';
import Button from '~frontend/components/button';
import Input from '~frontend/components/input';
import Modal from '~frontend/components/modal';
import { Fragment, useEffect, useState } from 'react';
import apiClient from '~frontend/lib/api';

const Users = () => {
	const [users, setUsers] = useState<any>([]);

	const getUsers = async () => {
		const { data } = await apiClient.admin.users.get();
		if (users?.error) return console.error('>> NeoLLMChat - Error getting users.', users.error);
		setUsers(data?.data ?? []);
	};

	const [addModel, setAddModel] = useState<boolean>(false);

	const handleAddModel = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		// const form = e.currentTarget as HTMLFormElement;
		// const username = form.model.value;
	};

	useEffect(() => {
		getUsers();
	}, []);

	return (
		<Fragment>
			<div className="animate-in fade-in space-y-2">
				<div className="flex-between-center">
					<h2 className="font-medium">Users</h2>
					<Button variant="ghost" size="icon" title="Add User" onClick={() => setAddModel(true)}>
						<PlusIcon className="size-4" />
					</Button>
				</div>

				{users?.map((user: any) => (
					<div key={user.id} className="w-full h-14 bg-accent flex-between-center gap-x-2 text-sm px-3 rounded-lg">
						<div className="flex flex-col items-start">
							<div>
								{user.username} ({user.role})
							</div>
							<div className="text-muted-foreground text-xs">{user.id}</div>
						</div>

						<div className="flex-end-center gap-x-2">
							<Button variant="ghost" size="icon" title="Edit">
								<PencilIcon className="size-4" />
							</Button>

							<Button variant="ghost" size="icon">
								<Trash2Icon className="size-4" />
							</Button>
						</div>
					</div>
				))}
			</div>

			<Modal clasName="max-w-[450px] space-y-3 p-5" open={addModel} onOpenChange={setAddModel}>
				<div className="flex-between-center">
					<h1 className="font-medium">Add User</h1>
					<Button variant="ghost" size="sm" title="Close" onClick={() => setAddModel(false)}>
						<XIcon className="size-5" />
					</Button>
				</div>

				<form className="space-y-3.5 flex-col flex-center-center" onSubmit={handleAddModel}>
					<Input type="text" name="username" placeholder="Username" required />
					<Input type="text" name="email" placeholder="Email" required />
					<Input type="password" name="password" placeholder="Password" required />

					<Button type="submit" className="w-full mt-3">
						Submit
					</Button>
				</form>
			</Modal>
		</Fragment>
	);
};

export default Users;
