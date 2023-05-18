import { useLasLink } from 'hooks';
import Link from 'next/link';
import { LastLinkKey } from 'types';

export const LinkProblems = ({ children }) => {
  const { lastLink } = useLasLink();
  return (
    <Link
      href={{ pathname: lastLink[LastLinkKey.PROBLEMS].pathname, query: lastLink[LastLinkKey.PROBLEMS].query }}
      className="link"
      prefetch
    >
      {children}
    </Link>
  );
};

export const LinkSectionProblem = ({ children }) => {
  const { lastLink } = useLasLink();
  return (
    <Link
      href={{
        pathname: lastLink[LastLinkKey.SECTION_PROBLEM].pathname,
        query: lastLink[LastLinkKey.SECTION_PROBLEM].query,
      }}
      className="link"
      prefetch
    >
      {children}
    </Link>
  );
};
