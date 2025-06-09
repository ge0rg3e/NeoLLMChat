import { twMerge } from '~frontend/lib/utils';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = ({ className, ...props }: Props) => {
	return (
		<input
			className={twMerge('w-full h-9 bg-card outline-none border text-sm rounded-lg px-3 text-foreground transition-smooth placeholder:text-muted-foreground focus:border-primary', className)}
			{...props}
		/>
	);
};

export default Input;
