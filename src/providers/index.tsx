import {
	createContext,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import { RouterContextValue, RouterProps, Route } from '../types';

const RouterContext = createContext<RouterContextValue | null>(null);

const findRoute = (routes: Route[], path: string): Route | undefined => {
	return routes.find(item => {
		const regex = item.path.replaceAll(/\[\w+\]/gi, '\\w+');
		return new RegExp(`^${regex}$`).test(path);
	});
};

function Router({ allowHistory, children, name, routes }: RouterProps) {
	const searchParams = useRef(new URLSearchParams(window.location.search));
	const [activeRoute, setActiveRoute] = useState<Route | undefined>(
		findRoute(routes, searchParams.current.get(`router_${name}`) || '/')
	);
	const history = useRef<string[]>([
		searchParams.current.get(`router_${name}`) || '/',
	]);
	const historyIndex = useRef(0);

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

	const _push = useCallback(
		(path: string, isBackOperation = false) => {
			// Update UI
			const route = findRoute(routes, path);
			setActiveRoute(route);

			// Concatenate new full path
			searchParams.current = new URLSearchParams(window.location.search);
			searchParams.current.set(`router_${name}`, path);
			const relativePath =
				window.location.pathname +
				'?' +
				decodeURIComponent(searchParams.current.toString());

			// Update URL Bar with new path
			if (allowHistory) {
				window.history.pushState(null, '', relativePath);
			} else {
				if (isBackOperation) {
					historyIndex.current--;
				} else {
					history.current.splice(historyIndex.current + 1);
					history.current.push(path);
					historyIndex.current++;
				}
				window.history.replaceState(null, '', relativePath);
			}
		},
		[allowHistory, name, routes]
	);

	const push = useCallback((path: string) => _push(path), [_push]);

	const back = useCallback(() => {
		if (allowHistory) {
			window.history.back();
		} else {
			const prevPath = history.current[historyIndex.current - 1];
			console.log('prevPath:', prevPath);
			if (prevPath) _push(prevPath, true);
		}
	}, [_push, allowHistory]);

	const handlePopState = useCallback(
		(event: PopStateEvent) => {
			searchParams.current = new URLSearchParams(
				(event.target as Window).location.search
			);
			const _path = searchParams.current.get(`router_${name}`) || '/';
			const route = findRoute(routes, _path);
			setActiveRoute(route);
		},
		[name, routes]
	);

	useEffect(() => {
		window.addEventListener('popstate', handlePopState);

		return () => {
			window.removeEventListener('popstate', handlePopState);
		};
	}, [handlePopState]);

	const providerValue = useMemo<RouterContextValue>(
		() => ({
			back,
			component: activeRoute?.component,
			name,
			pathname: activeRoute?.path,
			push,
			query,
		}),
		[activeRoute?.component, activeRoute?.path, back, name, push, query]
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
 * // 2. Create function to go back in history
 * 3. Create function to go forward in history
 * 4. Provide breadcrumbs data to context consumer
 * 5. Redirect
 * 6. Not Found
 */
