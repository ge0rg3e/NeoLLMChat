import Models from './groups/models';
import Users from './groups/users';

const AdminTab = () => {
	return (
		<div className="size-full pl-3 pr-7 animate-in fade-in">
			<Users />
			<div className="w-full h-px bg-border my-4" />
			<Models />
		</div>
	);
};

export default AdminTab;
