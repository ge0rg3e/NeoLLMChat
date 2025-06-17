import { useLiveQuery } from 'dexie-react-hooks';
import { useSync } from '~frontend/lib/sync';
import { useParams } from 'react-router';
import Message from './message';

const ChatMessages = () => {
	const { db } = useSync();
	const params = useParams();
	const chats = useLiveQuery(() => db.chats.toArray());
	const chat = chats?.find((chat) => chat.id === params.id);

	return (
		<div className="size-full max-h-[94vh] pt-5 pb-[160px] space-y-8 overflow-y-auto outline-none" id="chat-messages">
			{chat ? (
				chat.messages.map((data) => <Message key={data.id} data={data} />)
			) : (
				<div className="size-full flex-center-center">
					<p className="font-medium text-lg text-muted-foreground">Chat not found.</p>
				</div>
			)}
		</div>
	);
};

export default ChatMessages;
