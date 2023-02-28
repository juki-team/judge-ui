import { useLasLink } from 'hooks';
import Link from 'next/link';
import { LastLinkKey } from 'types';

export const LinkSheets = ({ children }) => {
  const { lastLink } = useLasLink();
  return (
    <Link
      href={{ pathname: lastLink[LastLinkKey.SHEETS].pathname, query: lastLink[LastLinkKey.SHEETS].query }}
      className="link"
    >
      {children}
    </Link>
  );
};
