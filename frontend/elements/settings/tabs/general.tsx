import { useNavigate } from 'react-router';
import apiClient from '~frontend/lib/api';
import useStore from '~frontend/stores';

const GeneralTab = () => {
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
				<button className="absolute right-0 text-destructive font-medium px-2.5 py-1 rounded-lg cursor-pointer transition-smooth hover:bg-destructive/5" onClick={handleLogout}>
					LogOut
				</button>
			</div>

			{/* Data Control */}
			<div className="flex-between-center">
				<div>Delete Chats History</div>

				<button className="bg-accent/30 border font-medium px-3 py-1 rounded-lg cursor-pointer transition-smooth hover:bg-accent/80" onClick={handleDeleteChats}>
					Delete
				</button>
			</div>
		</div>
	);
};

export default GeneralTab;
