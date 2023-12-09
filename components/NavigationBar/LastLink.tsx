import { useJukiRouter, useLastLink } from 'hooks';
import Link from 'next/link';
import { LastLinkKey, PropsWithChildren } from 'types';

interface LastLinkProps {
  lastLinkKey: LastLinkKey,
  onDoubleClickRoute?: string,
}

export const LastLink = ({ children, lastLinkKey, onDoubleClickRoute }: PropsWithChildren<LastLinkProps>) => {
  
  const { lastLink } = useLastLink();
  const { pushRoute } = useJukiRouter();
  
  return (
    <Link
      href={{ pathname: lastLink[lastLinkKey].pathname, query: lastLink[lastLinkKey].searchParams.toString() }}
      className="link"
      onClick={event => {
        if (onDoubleClickRoute && event.detail === 2) {
          void pushRoute(onDoubleClickRoute);
          event.preventDefault();
          event.stopPropagation();
        }
      }}
    >
      {children}
    </Link>
  );
};
