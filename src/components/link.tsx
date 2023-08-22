import { MouseEvent, useCallback } from 'react';
import usePrivateRouter from '../hooks/usePrivateRouter';
import { LinkProps } from '../types/link';

const Link = ({ children, href, state, ...props }: LinkProps) => {
	const { push } = usePrivateRouter();

	const handleClick = useCallback(
		(event: MouseEvent<HTMLAnchorElement>) => {
			event.preventDefault();
			if (!href)
				throw Error("Link component must have an 'href' attribute set");
			push(href, { state });
		},
		[href, push, state]
	);

	return (
		<>
			<a href='router:void(0)' onClick={handleClick} {...props}>
				{children}
			</a>
		</>
	);
};

export default Link;
