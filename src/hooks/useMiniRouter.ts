import { useContext } from 'react';
import { MiniRouterContext } from '../providers';

const useMiniRouter = () => {
	const miniRouterContext = useContext(MiniRouterContext);

	if (!miniRouterContext) {
		throw new Error(
			'useCurrentUser has to be used within <CurrentUserContext.Provider>'
		);
	}

	return miniRouterContext;
};

export default useMiniRouter;
