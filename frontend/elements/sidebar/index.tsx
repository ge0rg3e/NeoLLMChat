import { Link, useLocation } from 'react-router';
import apiClient from '~frontend/lib/api';
import { LogOutIcon } from 'lucide-react';
import useStore from '~frontend/stores';

const SideBar = () => {
	const location = useLocation();
	const { chats, session } = useStore();

	const handleLogout = async () => {
		try {
			await apiClient.auth.logout.post();
			useStore.setState({ session: null });
		} catch {}
	};

	return (
		<aside className="w-full max-w-[270px] h-screen p-3 bg-card flex-col flex-between-center">
			{/* Top */}
			<div className="w-full space-y-5">
				{/* New Chat */}
				<Link to="/" className="w-full h-9 px-3.5 flex-center-center rounded-lg bg-primary text-primary-foreground transition-smooth hover:bg-primary/90">
					<span className="font-medium text-base">New Chat</span>
				</Link>

				{/* Chats */}
				<div className="space-y-0.5">
					{chats.map((chat) => (
						<Link
							className={`w-full h-9 px-3.5 flex-start-center rounded-lg transition-smooth hover:bg-accent ${location.pathname === `/c/${chat.id}` ? 'bg-accent' : ''}`}
							to={`/c/${chat.id}`}
							key={chat.id}
						>
							<span className="text-sm text-foreground">{chat.title}</span>
						</Link>
					))}
				</div>
			</div>

			{/* Bottom */}
			<div className="w-full">
				{/* Account */}
				<button className="flex-between-center w-full h-9 px-3.5 bg-accent rounded-lg">
					<span>{session?.username}</span>
					<button className="flex-center-center cursor-pointer hover:text-destructive" onClick={handleLogout}>
						<LogOutIcon className="size-4.5" />
					</button>
				</button>
			</div>
		</aside>
	);
};

export default SideBar;
