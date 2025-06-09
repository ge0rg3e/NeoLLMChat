import { createBrowserRouter, RouterProvider } from 'react-router';
import { createRoot } from 'react-dom/client';
import { useEffect } from 'react';
import useStore from './stores';

// Pages
import SignIn from './pages/signin';
import Setup from './pages/setup';
import Home from './pages/home';
import Chat from './pages/chat';

// Style
import './globals.css';

const router = createBrowserRouter([
	{
		path: '/',
		element: <Home />
	},
	{
		path: '/c/:id',
		element: <Chat />
	},
	{
		path: '/signin',
		element: <SignIn />
	},
	{
		path: '/setup',
		element: <Setup />
	}
]);

const App = () => {
	const { init } = useStore();

	useEffect(() => {
		init();
	}, []);

	return <RouterProvider router={router} />;
};

createRoot(document.getElementById('root')!).render(<App />);
