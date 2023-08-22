import { ReactNode } from 'react';

export interface RouteWithComponent {
	path: string;
	component: ReactNode;
	redirect?: string;
}
export interface RouteWithRedirect {
	path: string;
	redirect: string;
	component?: ReactNode;
}

export type Route = RouteWithComponent | RouteWithRedirect;

export interface RouterProps {
	allowHistory?: boolean;
	children?: (routes: ReactNode) => ReactNode;
	name: string;
	routes: Route[];
}

export interface RouterState {
	[key: string]: string;
}
export interface PushOptions {
	state?: { [key: string]: string };
}

export interface RouterContextValue {
	back: () => void;
	forward: () => void;
	breadCrumbs: string[];
	name: string;
	pathname?: string;
	push: (path: string, options?: PushOptions) => void;
	query: { [key: string]: string };
	state: RouterState | null;
}
