import { createBrowserRouter, RouterProvider } from 'react-router';
import { createRoot } from 'react-dom/client';
import { useEffect } from 'react';
import useStore from './stores';

// Pages
import Register from './pages/register';
import Login from './pages/login';
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
		path: '/login',
		element: <Login />
	},
	{
		path: '/register',
		element: <Register />
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
