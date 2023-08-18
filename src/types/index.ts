import { ReactNode } from 'react';

export interface Route {
	path: string;
	component: ReactNode;
}

export interface RouterProps {
	allowHistory?: boolean;
	children?: (routes: ReactNode) => ReactNode;
	name: string;
	routes: Route[];
}

export interface RouterContextValue {
	back: () => void;
	component: ReactNode;
	name: string;
	pathname?: string;
	push: (path: string) => void;
	query: { [key: string]: string };
}
