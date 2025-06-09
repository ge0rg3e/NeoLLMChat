import { PaintBucketIcon, Settings2Icon, XIcon } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router';
import AppearanceTab from './tabs/appearance';
import GeneralTab from './tabs/general';
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
	}
];

const Settings = () => {
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

	const Content = tabs.find((tab) => tab.id === settingsTab)?.Content;
	if (!Content) return null;

	return (
		<div className="size-screen fixed top-0 left-0 z-50 bg-background/50 backdrop-blur-[2px] flex-center-center">
			<div className="relative size-full bg-card max-w-[760px] max-h-[550px] rounded-xl animate-in fade-in">
				{/* Header */}
				<div className="flex-between-center px-6 py-4">
					<h1 className="font-medium text-xl">Settings</h1>

					<button className="flex-center-center cursor-pointer transition-smooth hover:opacity-70" title="Close" onClick={handleClose}>
						<XIcon className="size-5" />
					</button>
				</div>

				<div className="flex flex-row gap-x-3">
					{/* Tabs */}
					<div className="size-full max-w-[180px] space-y-1.5 pl-3 pb-3">
						{tabs.map((tab) => (
							<button
								className={`w-full h-9 text-sm rounded-lg px-3 flex-start-center gap-x-2 cursor-pointer transition-smooth hover:bg-accent ${settingsTab === tab.id ? 'bg-accent' : ''}`}
								onClick={() => handleChangeTab(tab.id)}
								key={tab.id}
							>
								{tab.icon && <tab.icon className="size-4.5" />}
								{tab.label}
							</button>
						))}
					</div>

					<Content />
				</div>
			</div>
		</div>
	);
};

export default Settings;
