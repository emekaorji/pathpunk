import usePrivateRouter from './usePrivateRouter';

const useNavigate = () => {
	const { back, forward, breadCrumbs, pathname, push, state } =
		usePrivateRouter();

	return { back, forward, breadCrumbs, pathname, push, state };
};

export default useNavigate;
