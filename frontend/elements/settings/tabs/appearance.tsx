import { MoonIcon, SunIcon } from 'lucide-react';
import useTheme from '~frontend/lib/theme';

const AppearanceTab = () => {
	const { theme, setTheme } = useTheme();

	return (
		<div className="size-full pl-3 pr-7 animate-in fade-in">
			{/* Theme Selector */}
			<div className="flex-between-center gap-10">
				<button
					className={`w-full h-23 flex-center-center gap-y-2 cursor-pointer flex-col bg-accent/30 border rounded-lg transition-smooth ${
						theme === 'dark' ? 'border-primary bg-primary/20' : 'hover:border-primary hover:bg-primary/20'
					}`}
					onClick={() => setTheme('dark')}
				>
					<MoonIcon className="size-8" />
					<span>Dark</span>
				</button>
				<button
					className={`w-full h-23 flex-center-center gap-y-2 cursor-pointer flex-col bg-accent/30 border rounded-lg transition-smooth ${
						theme === 'light' ? 'border-primary bg-primary/20' : 'hover:border-primary hover:bg-primary/20'
					}`}
					onClick={() => setTheme('light')}
				>
					<SunIcon />
					<span>Light</span>
				</button>
			</div>
		</div>
	);
};

export default AppearanceTab;
