import { PanelLeftCloseIcon, PanelLeftOpenIcon } from 'lucide-react';
import { twMerge, useScreen } from '~frontend/lib/utils';
import { Tooltip } from '~frontend/components/tooltip';
import { Toaster } from '~frontend/components/sonner';
import { Button } from '~frontend/components/button';
import { Navigate, useLocation } from 'react-router';
import { useApp } from '~frontend/lib/context';
import Settings from './settings';
import { Fragment } from 'react';
import SideBar from './sidebar';

interface Props {
	className?: string;
	protectedRoute?: boolean;
	children: React.ReactNode;
}

const Layout = ({ className, protectedRoute = false, children }: Props) => {
	const { size } = useScreen();
	const location = useLocation();
	const { session, appearance, setAppearance } = useApp();

	const isAuthPage = ['/login', '/register'].includes(location.pathname);

	if (protectedRoute === true && session === null) return <Navigate to="/login" replace />;

	return (
		<Fragment>
			<div className={twMerge('relative flex flex-row', appearance.sidebarSide === 'left' ? 'flex-row' : 'flex-row-reverse')}>
				{!isAuthPage && appearance.sidebarClosed && (
					<Tooltip content="Open Sidebar" side={appearance.sidebarSide === 'left' ? 'right' : 'left'}>
						<Button
							className={twMerge('absolute top-3 z-10', appearance.sidebarSide === 'left' ? 'left-3' : 'right-3', size.width < 890 && '!backdrop-blur-xl')}
							onClick={() => setAppearance({ sidebarClosed: false })}
							variant={size.width < 890 ? 'outline' : 'ghost'}
							size="icon-lg"
						>
							{appearance.sidebarSide === 'right' ? <PanelLeftCloseIcon /> : <PanelLeftOpenIcon />}
						</Button>
					</Tooltip>
				)}

				{!isAuthPage && <SideBar />}
				<main
					className={twMerge(
						'bg-card bg-noise',
						className,
						!isAuthPage && size.width > 1100 && !appearance.sidebarClosed && 'mt-3.5',
						!appearance.sidebarClosed && appearance.sidebarSide === 'left' ? 'rounded-tl-xl' : 'rounded-tr-xl'
					)}
				>
					{children}
				</main>
			</div>

			<Settings />
			<Toaster />
		</Fragment>
	);
};

export default Layout;
