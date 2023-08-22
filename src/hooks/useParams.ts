import usePrivateRouter from './usePrivateRouter';

const useParams = () => {
	const { query } = usePrivateRouter();

	return query;
};

export default useParams;
