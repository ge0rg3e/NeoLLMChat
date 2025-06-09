import Layout from '~frontend/elements/layout';
import { useNavigate } from 'react-router';
import apiClient from '~frontend/lib/api';
import useStore from '~frontend/stores';

const SignIn = () => {
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const form = e.currentTarget as HTMLFormElement;
		const username = form.username.value;
		const password = form.password.value;

		const { data } = await apiClient.auth.signin.post({ username, password });
		if (data) {
			useStore.setState({ session: data.session });
			navigate('/');
		}
	};

	return (
		<Layout className="size-screen flex-center-center">
			<form className="w-full max-w-[350px] space-y-3.5 flex-col flex-center-center" onSubmit={handleSubmit}>
				<input className="w-full h-9 bg-card border rounded-lg px-3" type="text" name="username" placeholder="Your username" required />
				<input className="w-full h-9 bg-card border rounded-lg px-3" type="password" name="password" placeholder="Your password" required />
				<button type="submit" className="mt-3 w-full h-9.5 bg-primary text-primary-foreground font-medium rounded-lg cursor-pointer hover:bg-primary/90">
					Sign In
				</button>
			</form>
		</Layout>
	);
};

export default SignIn;
