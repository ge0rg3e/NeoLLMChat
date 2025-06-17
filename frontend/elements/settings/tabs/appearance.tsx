import { MoonIcon, PanelLeft, PanelRight, SunIcon } from 'lucide-react';
import { Button } from '~frontend/components/button';
import { useApp } from '~frontend/lib/context';
import { twMerge } from '~frontend/lib/utils';

const AppearanceTab = () => {
	const { appearance, setAppearance } = useApp();

	return (
		<div className="size-full pl-3 space-y-5 animate-in fade-in">
			{/* Theme Selector */}
			<div className="flex-between-center">
				<div>Theme</div>

				<div className="flex-end-center gap-x-1">
					<Button className={twMerge(appearance.theme === 'dark' && 'bg-accent')} variant="ghost" size="icon" title="Dark Theme" onClick={() => setAppearance({ theme: 'dark' })}>
						<MoonIcon />
					</Button>
					<Button className={twMerge(appearance.theme === 'light' && 'bg-accent')} variant="ghost" size="icon" title="Light Theme" onClick={() => setAppearance({ theme: 'light' })}>
						<SunIcon />
					</Button>
				</div>
			</div>

			{/* SideBar Side Selector */}
			<div className="flex-between-center">
				<div>SideBar Side</div>

				<div className="flex-end-center gap-x-1">
					<Button className={twMerge(appearance.sidebarSide === 'left' && 'bg-accent')} variant="ghost" size="icon" title="Left" onClick={() => setAppearance({ sidebarSide: 'left' })}>
						<PanelLeft />
					</Button>
					<Button className={twMerge(appearance.sidebarSide === 'right' && 'bg-accent')} variant="ghost" size="icon" title="Right" onClick={() => setAppearance({ sidebarSide: 'right' })}>
						<PanelRight />
					</Button>
				</div>
			</div>
		</div>
	);
};

export default AppearanceTab;
