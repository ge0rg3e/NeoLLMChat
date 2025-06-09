import Button from '~frontend/components/button';
import { useNavigate } from 'react-router';
import useTheme from '~frontend/lib/theme';
import apiClient from '~frontend/lib/api';
import useStore from '~frontend/stores';
import { MoonIcon, SunIcon } from 'lucide-react';
import { twMerge } from '~frontend/lib/utils';

const GeneralTab = () => {
	const { theme, setTheme } = useTheme();
	const navigate = useNavigate();
	const { session } = useStore();

	const handleLogout = async () => {
		try {
			await apiClient.auth.logout.post();
			useStore.setState({ session: null });
			navigate('/signin');
		} catch {}
	};

	const handleDeleteChats = async () => {
		try {
			useStore.setState({ chats: [] });
			await apiClient.chats.delete();
			navigate('/');
		} catch (err) {
			console.error('>> NeoLLMChat - Failed to delete chats.', err);
		}
	};

	if (!session) return null;

	return (
		<div className="size-full pl-3 pr-7 space-y-5 animate-in fade-in">
			{/* Account */}
			<div className="relative flex-start-center gap-x-2 border-b pb-5">
				{/* Avatar */}
				<div className="size-11 flex-center-center bg-accent rounded-full select-none">
					<span className="text-2xl text-muted-foreground">{session?.username[0]}</span>
				</div>

				{/* Info */}
				<div className="flex flex-col items-start">
					<div className="text-base">{session?.username}</div>
					<div className="text-xs text-muted-foreground">{session?.id}</div>
				</div>

				{/* Logout */}
				<Button variant="ghost" className="absolute right-0 !text-destructive hover:bg-destructive/5" onClick={handleLogout}>
					LogOut
				</Button>
			</div>

			{/* Theme Selector */}
			<div className="flex-between-center">
				<div>Theme</div>

				<div className="flex-end-center gap-x-1">
					<Button className={twMerge(theme === 'dark' && 'bg-accent')} variant="ghost" size="icon" title="Dark Theme" onClick={() => setTheme('dark')}>
						<MoonIcon />
					</Button>
					<Button className={twMerge(theme === 'light' && 'bg-accent')} variant="ghost" size="icon" title="Light Theme" onClick={() => setTheme('light')}>
						<SunIcon />
					</Button>
				</div>
			</div>

			{/* Data Control */}
			<div className="flex-between-center">
				<div>Delete Chats History</div>

				<Button variant="outline" onClick={handleDeleteChats}>
					Delete
				</Button>
			</div>
		</div>
	);
};

export default GeneralTab;
