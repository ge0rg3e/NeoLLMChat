import { createBrowserRouter, RouterProvider } from 'react-router';
import { createRoot } from 'react-dom/client';
import { useEffect } from 'react';
import useStore from './stores';

// Pages
import SignIn from './pages/signin';
import Setup from './pages/setup';
import Chat from './pages/chat';
import Home from './pages/home';

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
	const { init, requestSync } = useStore();

	useEffect(() => {
		init();
		requestSync();
	}, []);

	return <RouterProvider router={router} />;
};

createRoot(document.getElementById('root')!).render(<App />);
