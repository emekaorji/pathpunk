import { ReactNode } from 'react';

export interface Route {
	path: string;
	component: ReactNode;
}

export interface RouterProps {
	name: string;
	routes: Route[];
}

export interface RouterContextValue {
	push: (path: string) => void;
	component: ReactNode;
	name: string;
	pathname?: string;
	query: { [key: string]: string };
}
