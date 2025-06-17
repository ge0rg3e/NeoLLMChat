import { Toaster } from '~frontend/components/sonner';
import { Navigate, useLocation } from 'react-router';
import { useApp } from '~frontend/lib/context';
import { twMerge } from '~frontend/lib/utils';
import Settings from './settings';
import { Fragment } from 'react';
import SideBar from './sidebar';

interface Props {
	className?: string;
	protectedRoute?: boolean;
	children: React.ReactNode;
}

const Layout = ({ className, protectedRoute = false, children }: Props) => {
	const location = useLocation();
	const { session, appearance } = useApp();

	const isAuthPage = ['/login', '/register'].includes(location.pathname);

	if (protectedRoute === true && session === null) return <Navigate to="/login" replace />;

	return (
		<Fragment>
			<div className={twMerge('flex flex-row', appearance.sidebarSide === 'left' ? 'flex-row' : 'flex-row-reverse')}>
				{!isAuthPage && <SideBar />}
				<main className={twMerge('bg-card bg-noise', className, !isAuthPage && 'mt-3.5', appearance.sidebarSide === 'left' ? 'rounded-tl-xl' : 'rounded-tr-xl')}>{children}</main>
			</div>

			<Settings />
			<Toaster />
		</Fragment>
	);
};

export default Layout;
