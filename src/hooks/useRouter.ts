import { useContext } from 'react';
import { RouterContext } from '../providers';

const useRouter = () => {
	const miniRouterContext = useContext(RouterContext);

	if (!miniRouterContext) {
		throw new Error('useRouter has to be used within <RouterContext.Provider>');
	}

	return miniRouterContext;
};

export default useRouter;
