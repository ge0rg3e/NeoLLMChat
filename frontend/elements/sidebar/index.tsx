import { Link, useLocation, useNavigate } from 'react-router';
import { twMerge } from '~frontend/lib/utils';
import { Trash2Icon } from 'lucide-react';
import apiClient from '~frontend/lib/api';
import useStore from '~frontend/stores';

const SideBar = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { chats, session, deleteChat } = useStore();

	const handleDeleteChat = async (chatId: string) => {
		try {
			await deleteChat(chatId);
			await apiClient.chat.delete({ id: chatId });
			navigate('/');
		} catch (err) {
			console.error('>> NeoLLMChat - Failed to delete chat.', err);
		}
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
							className={twMerge('relative group w-full h-9 px-3.5 flex-start-center rounded-lg transition-smooth hover:bg-accent', location.pathname === `/c/${chat.id}` && 'bg-accent')}
							to={`/c/${chat.id}`}
							key={chat.id}
						>
							{/* Title */}
							<span className="text-sm text-foreground">{chat.title}</span>

							{/* Actions */}
							<div className="absolute flex-center-center right-3.5 transition-smooth opacity-0 group-hover:opacity-100">
								<button className="flex-center-center cursor-pointer transition-smooth hover:text-destructive" title="Delete" onClick={() => handleDeleteChat(chat.id)}>
									<Trash2Icon className="size-4" />
								</button>
							</div>
						</Link>
					))}

					{chats.length === 0 && <p className="text-center text-sm text-muted-foreground">No chat history...</p>}
				</div>
			</div>

			{/* Bottom */}
			<div className="w-full">
				{/* Account */}
				{session && (
					<Link className="w-full h-9 px-3.5 flex-start-center gap-x-2 rounded-lg transition-smooth hover:bg-accent" to="?settings=general">
						{/* Avatar */}
						<div className="size-7 flex-center-center bg-accent rounded-full select-none">
							<span className="text-muted-foreground">{session?.username[0]}</span>
						</div>

						{/* Info */}
						<div className="text-sm">{session?.username}</div>
					</Link>
				)}
			</div>
		</aside>
	);
};

export default SideBar;
