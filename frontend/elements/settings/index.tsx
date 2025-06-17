import { Settings2Icon, UserCogIcon, XIcon } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router';
import Button from '~frontend/components/button';
import Modal from '~frontend/components/modal';
import { useApp } from '~frontend/lib/context';
import { twMerge } from '~frontend/lib/utils';
import GeneralTab from './tabs/general';
import AdminTab from './tabs/admin';
import { useEffect } from 'react';

const tabs = [
	{
		id: 'general',
		label: 'General',
		icon: Settings2Icon,
		Content: GeneralTab
	},
	{
		id: 'admin',
		label: 'Admin',
		icon: UserCogIcon,
		Content: AdminTab
	}
];

const Settings = () => {
	const { session } = useApp();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const settingsTab = searchParams.get('settings');

	const handleClose = () => {
		searchParams.delete('settings');
		navigate({ search: searchParams.toString() });
	};

	const handleChangeTab = (tab: string) => {
		searchParams.set('settings', tab);
		navigate({ search: searchParams.toString() });
	};

	const handleKeydown = (e: KeyboardEvent) => {
		if (e.key === 'Escape') {
			handleClose();
		}
	};

	useEffect(() => {
		document.addEventListener('keydown', handleKeydown);
	}, []);

	const tab = tabs.find((tab) => tab.id === settingsTab);

	return (
		<Modal clasName="max-w-[760px] min-h-[500px]" open={Boolean(tab)} onOpenChange={(state) => state === false && handleClose()}>
			{/* Header */}
			<div className="flex-between-center px-6 py-4">
				<h1 className="font-medium text-xl">Settings</h1>

				<Button variant="ghost" size="sm" title="Close" onClick={handleClose}>
					<XIcon className="size-5" />
				</Button>
			</div>

			<div className="flex flex-row gap-x-3">
				{/* Tabs */}
				<div className="size-full max-w-[180px] space-y-1.5 pl-3 pb-3">
					{tabs.map((tab) => {
						if (tab.id === 'admin' && session?.role !== 'admin') return null;

						return (
							<button
								className={twMerge(
									'w-full h-9 text-sm rounded-lg px-3 flex-start-center gap-x-2 cursor-pointer transition-smooth hover:bg-accent',
									settingsTab === tab.id && 'bg-accent'
								)}
								onClick={() => handleChangeTab(tab.id)}
								key={tab.id}
							>
								{tab.icon && <tab.icon className="size-4.5" />}
								{tab.label}
							</button>
						);
					})}
				</div>

				{(tab?.id !== 'admin' || session?.role === 'admin') && tab && <tab.Content />}
			</div>
		</Modal>
	);
};

export default Settings;
