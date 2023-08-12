import useRouter from './useRouter';

const useParams = () => {
	const { query } = useRouter();

	return query;
};

export default useParams;
