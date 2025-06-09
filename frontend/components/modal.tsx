import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import { twMerge } from '~frontend/lib/utils';

interface Props {
	onOpenChange: (open: boolean) => void;
	clasName?: string;
	children: any;
	open: boolean;
}

const Modal = ({ children, open, onOpenChange, clasName }: Props) => {
	return (
		<Dialog open={open} onClose={() => onOpenChange(false)} className="relative z-50">
			<DialogBackdrop
				className="fixed inset-0 bg-background/50 backdrop-blur-[2px] transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
				transition
			/>

			<div className="fixed inset-0 z-10 w-screen overflow-y-auto">
				<div className="flex min-h-full justify-center items-center">
					<DialogPanel
						className={twMerge(
							'!size-full relative transform rounded-lg bg-card transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in data-closed:sm:translate-y-0 data-closed:sm:scale-95',
							clasName
						)}
						children={children}
						transition
					/>
				</div>
			</div>
		</Dialog>
	);
};

export default Modal;
