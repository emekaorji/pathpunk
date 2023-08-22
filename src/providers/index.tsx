import {
	createContext,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import {
	RouterContextValue,
	RouterProps,
	Route,
	PushOptions,
	RouterState,
} from '../types';

const RouterContext = createContext<RouterContextValue | null>(null);

const findRoute = (routes: Route[], path: string): Route | undefined => {
	return (
		routes.find(item => {
			const regex = item.path.replaceAll(/((:\w+)|(\[\w+\]))/gi, '\\w+');
			if (item.path !== '*') return new RegExp(`^${regex}$`).test(path);
		}) || routes.find(item => item.path === '*')
	);
};

const getCrumbs = (path: string) => {
	const crumbArray = path.replace(/^\//gi, '').split(/\//gi);
	return crumbArray[0] ? crumbArray : [];
};

function Router({ allowHistory, children, name, routes }: RouterProps) {
	const searchParams = useRef(new URLSearchParams(window.location.search));
	const [activeRoute, setActiveRoute] = useState<Route>();
	const [routerState, setRouterState] = useState<RouterState | null>(null);
	const [breadCrumbs, setBreadCrumbs] = useState<string[]>([]);
	const history = useRef<string[]>([
		searchParams.current.get(`router_${name}`) || '/',
	]);
	const historyIndex = useRef(0);
	const redirectId = useRef(0);

	const query = useMemo(() => {
		const obj: { [key: string]: string } = {};
		if (activeRoute) {
			const realPath = searchParams.current.get(`router_${name}`);
			if (realPath) {
				const arrOfKeys = activeRoute.path.replace(/^\//gi, '').split(/\//gi);
				const arrOfValues = realPath.replace(/^\//gi, '').split(/\//gi);
				arrOfKeys.forEach((key, index) => {
					const _key =
						key.match(/\[(\w+)\]/i)?.[1] || key.match(/:(\w+)/i)?.[1];
					if (_key) {
						obj[_key] = arrOfValues[index];
					}
				});
			}
		}
		return obj;
	}, [activeRoute, name]);

	const _push = useCallback(
		(
			path: string,
			historyOperation?: 'back' | 'forward',
			options?: PushOptions
		) => {
			clearTimeout(redirectId.current);
			// Render UI
			const route = findRoute(routes, path);
			if (route?.redirect) {
				redirectId.current = setTimeout(_push, 100, route.redirect);
			}
			setActiveRoute(route);
			setRouterState(options?.state || null);
			setBreadCrumbs(getCrumbs(path));

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
				if (historyOperation === 'back') {
					historyIndex.current--;
				} else if (historyOperation === 'forward') {
					historyIndex.current++;
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

	const push = useCallback(
		(path: string, options?: PushOptions) => _push(path, undefined, options),
		[_push]
	);

	const back = useCallback(() => {
		if (allowHistory) {
			window.history.back();
		} else {
			const prevPath = history.current[historyIndex.current - 1];
			if (prevPath) _push(prevPath, 'back');
		}
	}, [_push, allowHistory]);

	const forward = useCallback(() => {
		if (allowHistory) {
			window.history.forward();
		} else {
			const nextPath = history.current[historyIndex.current + 1];
			if (nextPath) _push(nextPath, 'forward');
		}
	}, [_push, allowHistory]);

	const reload = useCallback(() => {
		setActiveRoute(undefined);
		const id = setTimeout(() => {
			setActiveRoute(activeRoute);
			clearTimeout(id);
		}, 0);
	}, [activeRoute]);

	const renderUI = useCallback(() => {
		const _path = searchParams.current.get(`router_${name}`) || '/';

		// Update UI
		const route = findRoute(routes, _path);
		if (route?.redirect) {
			redirectId.current = setTimeout(_push, 0, route.redirect);
		}
		setActiveRoute(route);
		setBreadCrumbs(getCrumbs(_path));
	}, [_push, name, routes]);

	const handlePopState = useCallback(
		(event: PopStateEvent) => {
			searchParams.current = new URLSearchParams(
				(event.target as Window).location.search
			);
			renderUI();
		},
		[renderUI]
	);

	useEffect(() => {
		renderUI();
	}, [renderUI]);

	useEffect(() => {
		window.addEventListener('popstate', handlePopState);

		return () => {
			window.removeEventListener('popstate', handlePopState);
		};
	}, [handlePopState]);

	const providerValue = useMemo<RouterContextValue>(
		() => ({
			breadCrumbs,
			back,
			forward,
			name,
			pathname: activeRoute?.path,
			push,
			query,
			reload,
			state: routerState,
		}),
		[
			activeRoute?.path,
			back,
			forward,
			breadCrumbs,
			name,
			push,
			query,
			reload,
			routerState,
		]
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
