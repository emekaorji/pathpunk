import useMiniRouter from './useMiniRouter';

const useParams = () => {
	const { query } = useMiniRouter();

	return query;
};

export default useParams;
