import { ReactNode } from 'react';

export interface Route {
	path: string;
	component: ReactNode;
}

export interface MiniRouterProps {
	name: string;
	routes: Route[];
}

export interface MiniRouterContextValue {
	push: (path: string) => void;
	component: ReactNode;
	name: string;
	pathname?: string;
	query: { [key: string]: string };
}
