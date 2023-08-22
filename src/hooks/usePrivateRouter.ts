import { useContext } from 'react';
import { RouterContext } from '../providers';

const usePrivateRouter = () => {
	const miniRouterContext = useContext(RouterContext);

	if (!miniRouterContext) {
		throw new Error(
			'Router hooks have to be used within <RouterContext.Provider>'
		);
	}

	return miniRouterContext;
};

export default usePrivateRouter;
