import { Navigate, useLocation } from 'react-router';
import useStore from '~frontend/stores';
import Settings from './settings';
import { Fragment } from 'react';
import SideBar from './sidebar';

interface Props {
	className?: string;
	protectedRoute?: boolean;
	children: React.ReactNode;
}

const Layout = ({ className = '', protectedRoute = false, children }: Props) => {
	const session = useStore((state) => state.session);
	const location = useLocation();

	if (protectedRoute === true && session === null) return <Navigate to="/signin" replace />;

	return (
		<Fragment>
			<div className="flex flex-row">
				{!['/setup', '/signin'].includes(location.pathname) && <SideBar />}
				<main className={className}>{children}</main>
			</div>

			<Settings />
		</Fragment>
	);
};

export default Layout;
