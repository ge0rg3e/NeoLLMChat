import { useParams } from 'react-router';
import useStore from '~frontend/stores';
import Message from './message';

const ChatMessages = () => {
	const params = useParams();
	const { chats } = useStore();

	const chat = chats.find((chat) => chat.id === params.id);

	return (
		<div className="size-full max-h-[94vh] pt-5 pb-[160px] space-y-8 overflow-y-auto outline-none" id="chat-messages">
			{chat ? chat.messages.map((data) => <Message key={data.id} data={data} />) : <p>chat not found</p>}
		</div>
	);
};

export default ChatMessages;
