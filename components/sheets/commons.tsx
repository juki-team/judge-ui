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

export const LinkSectionSheet = ({ children }) => {
  const { lastLink } = useLasLink();
  return (
    <Link
      href={{ pathname: lastLink[LastLinkKey.SECTION_SHEET].pathname, query: lastLink[LastLinkKey.SECTION_SHEET].query }}
      className="link"
    >
      {children}
    </Link>
  );
};
