import { createContext, useCallback, useMemo, useRef, useState } from 'react';
import { RouterContextValue, RouterProps, Route } from '../types';

const RouterContext = createContext<RouterContextValue | null>(null);

const findRoute = (routes: Route[], path: string): Route | undefined => {
	return routes.find(item => {
		const regex = item.path.replaceAll(/\[\w+\]/gi, '\\w+');
		return new RegExp(`^${regex}$`).test(path);
	});
};

function Router({ children, name, routes }: RouterProps) {
	const searchParams = useRef(new URLSearchParams(window.location.search));
	const [activeRoute, setActiveRoute] = useState<Route | undefined>(
		findRoute(routes, searchParams.current.get(`router_${name}`) || '/')
	);

	const query = useMemo(() => {
		const obj: { [key: string]: string } = {};
		if (activeRoute) {
			const realPath = searchParams.current.get(`router_${name}`);
			if (realPath) {
				const arrOfKeys = [...activeRoute.path.matchAll(/\[(\w+)\]/gi)];
				const arrOfValues = [...realPath.matchAll(/(\w+)/gi)];
				arrOfKeys.forEach(([_, param], index) => {
					obj[param] = arrOfValues[index]?.[1];
				});
			}
		}
		return obj;
	}, [activeRoute, name]);

	const push = useCallback(
		(path: string) => {
			searchParams.current = new URLSearchParams(window.location.search);
			const route = findRoute(routes, path);
			setActiveRoute(route);
			searchParams.current.set(`router_${name}`, path);
			const relativePath =
				window.location.pathname +
				'?' +
				decodeURIComponent(searchParams.current.toString());
			window.history.replaceState(null, '', relativePath);
		},
		[name, routes]
	);

	const providerValue = useMemo<RouterContextValue>(
		() => ({
			component: activeRoute?.component,
			name,
			pathname: activeRoute?.path,
			push,
			query,
		}),
		[activeRoute?.component, activeRoute?.path, name, push, query]
	);

	return (
		<RouterContext.Provider value={providerValue}>
			{(() => {
				const content = activeRoute ? activeRoute.component : 'NotFound';
				return children ? children(content) : content;
			})()}
		</RouterContext.Provider>
	);
}

export { RouterContext };
export default Router;

/**
 * TODO
 * 1. Create function to reload router
 * 2. Create function to go back in history
 * 3. Create function to go forward in history
 */
