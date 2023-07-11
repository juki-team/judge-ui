import { useLasLink, useRouter } from 'hooks';
import Link from 'next/link';
import { LastLinkKey, PropsWithChildren } from 'types';
import { ROUTES } from '../../config/constants';

export const LinkProblems = ({ children }: PropsWithChildren) => {
  
  const { lastLink } = useLasLink();
  
  return (
    <Link
      href={{ pathname: lastLink[LastLinkKey.PROBLEMS].pathname, query: lastLink[LastLinkKey.PROBLEMS].query }}
      className="link"
    >
      {children}
    </Link>
  );
};

export const LinkSectionProblem = ({ children }: PropsWithChildren) => {
  
  const { lastLink } = useLasLink();
  const { push } = useRouter();
  
  return (
    <Link
      href={{
        pathname: lastLink[LastLinkKey.SECTION_PROBLEM].pathname,
        query: lastLink[LastLinkKey.SECTION_PROBLEM].query,
      }}
      className="link"
      onClick={event => {
        if (event.detail === 2) {
          void push(ROUTES.PROBLEMS.LIST());
          event.preventDefault();
          event.stopPropagation();
        }
      }}
    >
      {children}
    </Link>
  );
};
