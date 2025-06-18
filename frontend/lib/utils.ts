import { twMerge as _twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';
import { useState, useEffect } from 'react';

export const twMerge = (...inputs: ClassValue[]) => _twMerge(clsx(inputs));

export const useScreen = () => {
	const [size, setSize] = useState({
		width: window.innerWidth,
		height: window.innerHeight
	});

	const handleResize = () => {
		setSize({
			width: window.innerWidth,
			height: window.innerHeight
		});
	};

	useEffect(() => {
		handleResize();
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return {
		size
	};
};
