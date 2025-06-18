import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~frontend/components/dialog';
import { InfoIcon, PaintBucketIcon, Settings2Icon, UserCogIcon } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router';
import { useApp } from '~frontend/lib/context';
import AppearanceTab from './tabs/appearance';
import { twMerge } from '~frontend/lib/utils';
import GeneralTab from './tabs/general';
import AdminTab from './tabs/admin';
import AboutTab from './tabs/about';
import { useEffect } from 'react';

const tabs = [
	{
		id: 'general',
		label: 'General',
		icon: Settings2Icon,
		Content: GeneralTab
	},
	{
		id: 'appearance',
		label: 'Appearance',
		icon: PaintBucketIcon,
		Content: AppearanceTab
	},
	{
		id: 'admin',
		label: 'Admin',
		icon: UserCogIcon,
		Content: AdminTab
	},
	{
		id: 'about',
		label: 'About',
		icon: InfoIcon,
		Content: AboutTab
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
		<Dialog open={Boolean(tab)} onOpenChange={(state) => state === false && handleClose()}>
			<DialogContent className="size-full !max-w-[760px] !max-h-[500px]">
				<DialogHeader>
					<DialogTitle>Settings</DialogTitle>
				</DialogHeader>

				<div className="h-[400px] flex flex-row gap-x-3">
					{/* Tabs */}
					<div className="size-full max-w-[180px] space-y-1.5">
						{tabs.map((tab, index) => {
							if (tab.id === 'admin' && session?.role !== 'admin') return null;

							return (
								<button
									className={twMerge(
										'w-full h-9 text-sm rounded-lg px-3 flex-start-center gap-x-2 cursor-pointer transition-smooth hover:bg-accent',
										settingsTab === tab.id && 'bg-accent'
									)}
									onClick={() => handleChangeTab(tab.id)}
									key={index}
								>
									{tab.icon && <tab.icon className="size-4.5" />}
									{tab.label}
								</button>
							);
						})}
					</div>

					{(tab?.id !== 'admin' || session?.role === 'admin') && tab && <tab.Content />}
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default Settings;
