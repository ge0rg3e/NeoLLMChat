import type { Theme } from '~frontend/stores/types';
import useStore from '~frontend/stores';
import { useEffect } from 'react';

const useTheme = () => {
	const theme = useStore((state) => state.theme);

	const setTheme = (theme: Theme) => {
		useStore.setState({ theme });
		localStorage.setItem('theme', theme);
	};

	useEffect(() => {
		if (theme === 'dark') {
			document.documentElement.classList.remove('neollmchat-light');
			document.documentElement.classList.add('neollmchat-dark');
			document.documentElement.style.colorScheme = 'dark';
		} else {
			document.documentElement.classList.remove('neollmchat-dark');
			document.documentElement.classList.add('neollmchat-light');
			document.documentElement.style.colorScheme = 'light';
		}
	}, [theme]);

	return { setTheme, theme };
};

export default useTheme;
