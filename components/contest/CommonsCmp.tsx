import { ButtonLoader, PlusIcon, T } from 'components';
import { ROUTES } from 'config/constants';
import { buttonLoaderLink } from 'helpers';
import { useLasLink, useRouter } from 'hooks';
import Link from 'next/link';
import { ContestsTab, LastLinkKey, PropsWithChildren } from 'types';

export const CreateContestButton = () => {
  
  const { push } = useRouter();
  
  return (
    <ButtonLoader
      size="small"
      icon={<PlusIcon />}
      onClick={buttonLoaderLink(() => push(ROUTES.CONTESTS.CREATE()))}
      responsiveMobile
    >
      <T>create</T>
    </ButtonLoader>
  );
};

export const LinkContests = ({ children }: PropsWithChildren) => {
  
  const { lastLink } = useLasLink();
  
  return (
    <Link
      href={{ pathname: lastLink[LastLinkKey.CONTESTS].pathname, query: lastLink[LastLinkKey.CONTESTS].query }}
      className="link"
    >
      {children}
    </Link>
  );
};

export const LinkSectionContest = ({ children }: PropsWithChildren) => {
  
  const { lastLink } = useLasLink();
  const { push } = useRouter();
  
  return (
    <Link
      href={{
        pathname: lastLink[LastLinkKey.SECTION_CONTEST].pathname,
        query: lastLink[LastLinkKey.SECTION_CONTEST].query,
      }}
      className="link"
      onClick={event => {
        if (event.detail === 2) {
          void push(ROUTES.CONTESTS.LIST(ContestsTab.ALL));
          event.preventDefault();
          event.stopPropagation();
        }
      }}
    >
      {children}
    </Link>
  );
};
