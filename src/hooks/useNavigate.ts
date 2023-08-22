import usePrivateRouter from './usePrivateRouter';

const useNavigate = () => {
	const { back, forward, breadCrumbs, pathname, push, reload, state } =
		usePrivateRouter();

	return { back, forward, breadCrumbs, pathname, push, reload, state };
};

export default useNavigate;
