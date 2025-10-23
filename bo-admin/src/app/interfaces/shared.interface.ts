export interface ITableData {
	id: string;
	username: string;
	fullname: string;
	lastname: string;
	role: number;
	lastConnection: string;
}

export interface ITableAbstract {
	id: number;
}

export interface IToastData {
	id: string;
	active: boolean;
	content: string;
	kind: 'success' | 'warning' | 'error' | 'info';
}

export interface INavigationTab {
	path: string;
	name: string;
}
