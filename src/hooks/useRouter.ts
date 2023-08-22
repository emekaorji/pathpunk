import usePrivateRouter from './usePrivateRouter';

const useRouter = () => {
	const { name } = usePrivateRouter();

	return { name };
};

export default useRouter;
