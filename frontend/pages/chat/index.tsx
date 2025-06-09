import ChatMessages from '~frontend/elements/chat-messages';
import ChatInput from '~frontend/elements/chat-input';
import Layout from '~frontend/elements/layout';

const Chat = () => {
	return (
		<Layout protectedRoute className="size-screen flex-between-center flex-col">
			<ChatMessages />
			<ChatInput />
		</Layout>
	);
};

export default Chat;
