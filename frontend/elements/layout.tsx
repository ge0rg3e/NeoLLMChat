import { Toaster } from '~frontend/components/sonner';
import { Navigate, useLocation } from 'react-router';
import { twMerge } from '~frontend/lib/utils';
import useStore from '~frontend/stores';
import Settings from './settings';
import { Fragment } from 'react';
import SideBar from './sidebar';

interface Props {
	className?: string;
	protectedRoute?: boolean;
	children: React.ReactNode;
}

const Layout = ({ className, protectedRoute = false, children }: Props) => {
	const session = useStore((state) => state.session);
	const location = useLocation();

	if (protectedRoute === true && session === null) return <Navigate to="/login" replace />;

	return (
		<Fragment>
			<div className="flex flex-row">
				{!['/login', '/register'].includes(location.pathname) && <SideBar />}
				<main className={twMerge(className)}>{children}</main>
			</div>

			<Settings />
			<Toaster />
		</Fragment>
	);
};

export default Layout;
