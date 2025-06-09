import { twMerge as _twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';

export const twMerge = (...inputs: ClassValue[]) => _twMerge(clsx(inputs));
