import { MouseEvent, useCallback } from 'react';
import useRouter from '../hooks/useRouter';
import { LinkProps } from '../types/link';

const Link = ({ children, href, ...props }: LinkProps) => {
	const { push } = useRouter();

	const handleClick = useCallback(
		(event: MouseEvent<HTMLAnchorElement>) => {
			event.preventDefault();
			if (!href)
				throw Error("Link component must have an 'href' attribute set");
			push(href);
		},
		[href, push]
	);

	return (
		<>
			<a href="router:void(0)" onClick={handleClick} {...props}>
				{children}
			</a>
		</>
	);
};

export default Link;
